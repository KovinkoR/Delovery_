import express from 'express';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';
import getCoords from '../geo_functions/getCoords.js';

import { sessionCourierChecker, sessionUserChecker } from '../middleware/sessionWorker.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser && await bcrypt.compare(password, findUser.password)) {
      req.session.user = findUser;
      return res.redirect('/offers');
    }
    res.render('errors', { err: 'Пользователь не найден' });
  } catch (error) {
    res.send(error);
  }
});

router.get('/signup', sessionCourierChecker, sessionUserChecker, (req, res) => {
  res.render('user/userSignup');
});

router.post('/signup', async (req, res) => {
  const {
    userName,
    userPhone,
    userEmail,
    userPassword,
    userLocation,
  } = req.body;
  try {
    const newUser = new User({
      userName,
      phone: userPhone,
      email: userEmail,
      password: await bcrypt.hash(userPassword, 10),
      location: userLocation,
      coordinates: await getCoords(userLocation),
    });
    await newUser.save();
    req.session.user = newUser;
    res.redirect('/offers');
  } catch (error) {
    res.render('errors', { err: 'Пользователь уже существует или данные не верны!' });
  }
});

router.get('/profile', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render('user/userProfile', { user });
});

export default router;
