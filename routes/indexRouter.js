import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  // res.send('it is alive!')
  res.render('home');
});


router.get('/logout', async (req, res) => {
  if (req.session.user || req.session.courier) {
    await req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/');
  }
});

export default router;
