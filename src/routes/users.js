const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const validation = require("./validation");
// const helper = require("../auth/helpers");

router.get("/users/sign_up", userController.signUpForm);
router.post("/users/sign_up", validation.validateUserSignUp, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_in_failed", userController.signInFailed);
router.post("/users/sign_in", validation.validateUserSignIn, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
router.get("/users", userController.index);
router.post("/users/:id/upgrade", userController.upgrade);
router.post("/users/:id/downgrade", userController.downgrade);
// router.post("/users/:id/destroy", userController.destroy);

module.exports = router;