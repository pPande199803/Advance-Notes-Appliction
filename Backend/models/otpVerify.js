import mongoose from "mongoose";

const otpVerification = mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timeStamp: true }
);

const otpVerify =  new mongoose.model("otpVerify", otpVerification);
export default otpVerify;
