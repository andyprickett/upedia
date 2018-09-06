const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUpForm);
router.post("/users/sign_up", validation.validateUsers, userController.create);
// router.get("/users/sign_in", userController.signInForm);
// router.post("/users/sign_in", validation.validateUsers, userController.signIn);
// router.get("/users/sign_out", userController.signOut);
// router.get("/users/:id", userController.show);

module.exports = router;