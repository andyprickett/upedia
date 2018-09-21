const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUpForm(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: 'signedup@blocipedia.com',
          subject: "You've Signed Up with Blocipedia!",
          text: 'Log in and start collaborating on wikis!',
          html: '<strong>Log in and start collaborating on wikis!</strong>',
        };
        sgMail.send(msg);
        // passport.authenticate("local")(req, res, () => {
          // req.flash("notice", "You've successfully signed in!");
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        // })
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local", {failureRedirect: "/users/sign_in", failureFlash: true})(req, res, () => {
      if(!req.user) {
        /* Never gets here because of "failureRedirect" above, which is a substitute
           for the default Passport 401 error page. This stuff didn't work anyways!! 
           From the docs:

           "If this function gets called, authentication was successful. `req.user` contains 
           the authenticated user. 
           
           By default, if authentication fails, Passport will respond with a 401 Unauthorized 
           status, and any additional route handlers will not be invoked. If authentication 
           succeeds, the next handler will be invoked and the req.user property will be set 
           to the authenticated user."

           These two lines below will only work if you use a Custom Callback, which we're not.
        */
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        // This will happen if authentication works.
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  // signInFailed(req, res, next) {
  //   // Substitute for Passport error handling, which I couldn't get to work :(
  //   req.flash("notice", "Signin credentials didn't work. Please try again.");
  //   res.redirect("/users/sign_in");
  // },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  // show(req, res, next) {
  //   userQueries.getUser(req.params.id, (err, result) => {
  //     if(err || result.user === undefined) {
  //       req.flash("notice", "No user found with that ID.");
  //       res.redirect("/");
  //     } else {
  //       res.render("users/show", {...result});
  //     }
  //   });
  // }
}