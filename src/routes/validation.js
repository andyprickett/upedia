module.exports = {
  validate____(req, res, next) {


    

    const errors = req.validationErrors();

    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  }
}