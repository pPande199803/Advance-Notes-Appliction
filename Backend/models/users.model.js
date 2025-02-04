import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    otp:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timeStamp: true }
);

const user =  new mongoose.model("User", userSchema);
export default user;
