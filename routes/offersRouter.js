import express from "express";
import { OfferModel } from "../models/offerModel.js";
import UserModel from "../models/userModel.js";
import CourierModel from "../models/courierModel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import compareCoords from '../geo_functions/compareCoords.js'
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const offers = await OfferModel.find();
  const closeOffers = offers.filter(offer => {
    if (compareCoords(offer.coordinates, req.session.user.coordinates, 5)) return offer;
  });
  res.render("offer/offers", { offers: closeOffers });
});

router.get("/:id", async (req, res) => {
  const offer = await OfferModel.findById(req.params.id);
  res.render("offer/oneOffer", { offer });
});

router.post("/:id", async function (req, res) {

  try {
    const yourOrder = await OfferModel.findById(req.params.id);
    if (yourOrder) {
      const user = await UserModel.findOne({ email: req.session.user.email });

      const yourCourier = await CourierModel.findById(yourOrder.courierId)

      user.currentOrder = yourOrder;
      yourOrder.userId = user._id;
      yourCourier.currentOrder = yourOrder;
      await user.save();
      await yourCourier.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const courierMailOptions = {
        from: "deloveryelbrus@gmail.com",
        to: user.email,
        subject: "Your order",
        text: `Good day ${user.userName}! 
        Thank you for your choice! Your order number ${yourOrder._id}, will be delivered by courier ${yourCourier.userName} within 30 minutes.
        To clarify the details, you can contact him via number ${yourCourier.phone}.
        Enjoy your meal!`,
      };

      const mailOptions = {
        from: "deloveryelbrus@gmail.com",
        to: yourCourier.email,
        subject: "Your order",
        text: `Good day ${yourCourier.userName}! 
        Your order number ${yourOrder._id}, have been paid by ${user.userName}.
        It must be delivered to the address ${user.location} within 30 minutes. To clarify the details, you can contact him via number ${user.phone}.
        Thanks for your work!`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log("email sent" + info.response);
      });
      transporter.sendMail(courierMailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log("email sent" + info.response);
      });
      OfferModel.findByIdAndDelete(req.params.id, function(err) {
        if (err) console.log(err);
        console.log("Successful deletion");
      })
      res.redirect("/");
    }
  } catch (error) {
    res.send(error.message);
  }
});

export default router;
