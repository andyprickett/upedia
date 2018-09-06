const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: { email }
      })
      .then((user) => {
        /* This all differs slightly from current Passport docs, and other
           stuff people have figured out. It doesn't work as expected as is.
           However, udating it to the other ways didn't either :(
        */
        if(!user || !authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid email or password." });
        }
        return done(null, user);
      })
    }));

    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err => {
        callback(err, user);
      }))
    });
  }
}