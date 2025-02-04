import express from "express";
import {
  registerUser,
  loginUser,
  sendOtpForValidation,
  otpVerification,
  forgetPassword,
  getAllUserData,
  changePassword,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/allUser", getAllUserData);
router.post("/register-user", registerUser);
router.put("/updateUser/:_id", changePassword);
router.post("/login-user", loginUser);
router.get("/otp-verify/:emailId", sendOtpForValidation);
router.get("/otp-verification/:emailId/:otp", otpVerification);
router.post("/forget-password", forgetPassword);

export default router;
