module.exports = {
  validateUserSignUp(req, res, next) {
    if(req.method === "POST") {
      // req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "Must be at least 6 characters in length.").isLength({min: 6});
      req.checkBody("passwordConfirmation", "Must match password provided.").equals(req.body.password);
    }
     
    const errors = req.validationErrors();

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  },
  validateUserSignIn(req, res, next) {
    if(req.method === "POST") {
      // req.checkBody("email", "Must be a valid email address.").isEmail();
      req.checkBody("password", "Must have been at least 6 characters in length.").isLength({min: 6});
      // req.checkBody("passwordConfirmation", "Must match password provided.").equals(req.body.password);
    }
     
    const errors = req.validationErrors();

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  }
}