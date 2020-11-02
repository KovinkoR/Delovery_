import express from "express";
import bcrypt from "bcrypt";

import Couriers from "../models/courierModel.js";
import { OfferModel } from "../models/offerModel.js";
import UserModel from "../models/userModel.js";
import getCoords from "../geo_functions/getCoords.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const findCourier = await Couriers.findOne({ email });
    if (findCourier && await bcrypt.compare(password, findCourier.password)) {
      req.session.courier = findCourier;
      return res.redirect('/courier/newOffer');
    }
    res.render('errors', { err: 'Личный кабинет курьера не найден!' });
  } catch (error) {
    res.send(error);
  }
});

router.get("/signup", (req, res) => {
  res.render("courier/courierSignup");
});

router.post('/signup', async (req, res) => {
  const {
    courierName,
    courierphone,
    courieremail,
    courierpassword,
  } = req.body;
  try {
    const newCouriers = new Couriers({
      userName: courierName,
      phone: courierphone,
      email: courieremail,
      password: await bcrypt.hash(courierpassword, 10),
    });
    await newCouriers.save();
    req.session.courier = newCouriers;
    res.redirect("/courier/newOffer");
  } catch (error) {
    res.render('errors', { err: 'ЛК курьера уже создан или данные не верны!' });
  }
});

router.get("/newOffer", (req, res) => {
  res.render("courier/courierNewOffer");
});

router.post("/newOffer", async (req, res) => {
  const { select, price, location } = req.body;

  let picSrc;
  if (select === "Macdonalds") {
    picSrc = "Macdonalds";
  }
  if (select === "KFC") {
    picSrc = "KFC";
  }
  if (select === 'BurgerKing') {
    picSrc = 'BurgerKing';
  }

  const values = Object.values(req.body).slice(1, -2);
  const courierId = req.session.courier._id;

  const newOffer = new OfferModel({
    contents: [...values],
    picSrc,
    price,
    createdAt: new Date(),
    courierId,
    location,
    coordinates: await getCoords(location),
  });
  await newOffer.save();

  const currentCourier = await Couriers.findById(req.session.courier._id);
  currentCourier.currentOrder = newOffer;
  await currentCourier.save();

  res.redirect("/courier/profile");
});

router.get("/profile", async (req, res) => {
  const courier = await Couriers.findById(req.session.courier._id);
  res.render("courier/courierProfile", { courier });
});

router.post("/confirm", async (req, res) => {
  const courier = await Couriers.findOne({ email: req.session.courier.email });
  const user = await UserModel.findById( courier.currentOrder.userId);

  courier.ordersArchive.push(courier.currentOrder);
  courier.currentOrder = null;

  user.ordersArchive.push(user.currentOrder);
  user.currentOrder = null;  

  await user.save();
  await courier.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "deloveryelbrus@gmail.com",
    to: user.email,
    subject: "Deliver confirmation",
    text: `Good day ${user.userName}! 
    Thank you for you order, see you soon!
    `
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("email sent" + info.response);
  });
  res.redirect("/courier/profile")
});

export default router;
