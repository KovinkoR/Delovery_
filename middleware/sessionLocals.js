export default function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.courier = req.session.courier;
  next();
}
