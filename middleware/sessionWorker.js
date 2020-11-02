const sessionUserChecker = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    next();
  }
};

const sessionCourierChecker = (req, res, next) => {
  if (req.session.courier) {
    res.redirect("/courier/newOffer");
  } else {
    next();
  }
};

function cookiesCleaner(req, res, next) {
  if (req.cookies.user_sid && !req.session.user && !req.session.courier) {
    res.clearCookie("user_sid");
  }
  next();
}


export { sessionUserChecker, sessionCourierChecker, cookiesCleaner };
