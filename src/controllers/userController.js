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
      // passwordConfirmation: req.body.passwordConfirmation // do I need this?
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
          from: 'signedup@upedia.com',
          subject: "You've Signed Up with Upedia!",
          text: 'Log in and start collaborating on wikis!',
          html: '<strong>Log in and start collaborating on wikis!</strong>',
        };
        sgMail.send(msg)
        .catch((err) => {
          console.log("SendGrid error, probably API key.");
          console.log(err); // SendGrid API key error ("Unauthorized") must be caught here!!
        });
        // passport.authenticate("local")(req, res, () => {   // nope, not yet
          // req.flash("notice", "You've successfully signed in!"); // nope
          req.flash("notice", "You've successfully signed up!");
          // Good for you, now go sign in:
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
           for the default Passport 401 error page. This stuff below didn't work anyways!!
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
        // Hate this redirect to Home, but "redirect to same page" solution is too complicated for me :(
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
  show(req, res, next) {
    userQueries.getUser(req, (err, result) => {
      if(err || result.user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {...result});
      }
    });
  },
  index(req, res, next) {
    userQueries.getAllUsers((err, users) => {
      if(err) {
        res.redirect(500, "static/index");
      } else {
        res.render("users/index", { users });
      }
    });
  },
  /*
  destroy(req, res, next) {
    userQueries.deleteUser(req, (err, deletedRecordsCount) => {
      if(err) {
        res.redirect(err, `/users/${req.params.id}`);
      } else {
        req.flash("notice", "User has been deleted.");
        res.redirect(303, "/users");
      }
    });
  },
  */
  upgrade(req, res, next) {
    userQueries.upgradeUser(req, (err, user) => {
      if(err || user == null) {
        req.flash("notice", "Something went wrong.");
        res.redirect(err, "/users");
      } else {
        req.flash("notice", "Nice! You've been upgraded!");
        // res.redirect(req.headers.referer);
        res.redirect(`/users/${req.params.id}`);
      }
    });
  },
  downgrade(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if(err || user == null) {
        req.flash("notice", "Something went wrong.");
        res.redirect(err, "/users");
      } else {
        req.flash("notice", "Bummer! You've downgraded!");
        // res.redirect(req.headers.referer);
        res.redirect(`/users/${req.params.id}`);
      }
    });
  }
}