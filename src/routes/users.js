const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/users/sign_up", userController.signUpForm);
router.post("/users/sign_up", validation.validateUserSignUp, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_in_failed", userController.signInFailed);
router.post("/users/sign_in", validation.validateUserSignIn, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
router.get("/users", userController.index);


module.exports = router;