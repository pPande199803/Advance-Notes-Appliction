import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpVerify from "../models/otpVerify.js";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Hash password error",
      });
    } else {
      const existingUser = await User.findOne({
        email: req.body.email,
        userName: req.body.userName,
      });
      if (existingUser) {
        return res.status(200).send({
          message: "User Already Exist",
          success: false,
        });
      }
      const user = new User({
        userName: req.body.userName,
        emailId: req.body.emailId,
        otp: req.body.otp,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(200).send({
            message: "Account Has been Create",
            success: true,
            user,
          });
        })
        .catch(() => {
          res.status(500).send({
            message: "Authentication Failed....",
            success: false,
          });
        });
    }
  });
};

export const loginUser = async (req, res) => {
  // res.json("Login Work")
  User.find({ emailId: req.body.emailId })
    .exec()
    .then(async (result) => {
      if (result.length < 1) {
        return res.status(401).send({
          message: "User Not Found",
          success: false,
        });
      }
      const user = result[0];
      // console.log(user)
      const match = await bcrypt.compare(req.body.password, user.password);
      console.log(match);
      if (match) {
        const payload = {
          UserName: user.userName,
          emailId: user.emailId,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.status(200).send({
          message: "Login Successfully",
          success: true,
          token: token,
          user,
        });
      } else {
        res.status(500).send({
          message: "User Not Login",
          success: false,
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: "Something Went Worng",
        success: false,
        error,
      });
    });
};

export const getAllUserData = async (req, res) => {
  try {
    await User.find().then((result) => {
      res.status(201).send({
        message: "Getting All Notes Data",
        success: true,
        userData: result,
      });
    });
  } catch (error) {
    res.status(501).send({
      message: "Something went worong in Get notes Api",
      success: false,
      error,
    });
  }
};

export const changePassword = async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Hash password error",
      });
    } else {
      try {
        console.log(req.params._id);
        await User.findByIdAndUpdate(
          { _id: req.params._id },
          {
            $set: {
              userName: req.body.userName,
              emailId: req.body.emailId,
              otp: req.body.otp,
              password: hash,
            },
          }
        ).then((result) => {
          res.status(201).send({
            message: "User Data Updated",
            success: true,
            result,
          });
        });
      } catch (error) {
        res.status(501).send({
          message: "Something went worong in update notes Api",
          success: false,
          error,
        });
      }
    }
  });
};

export const sendOtpForValidation = async (req, res) => {
  const emailId = req.params.emailId;
  //   console.log(req.params.emailId);

  const otp = Math.floor(Math.random() * 900000) + 100000;
  //   console.log(otp);

  if (!emailId) res.send("Enter Email Id first");

  const payload = {
    emailId: req.params.emailId,
    otp: otp,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "5m",
  });

  const otpData = new otpVerify({
    emailId: req.params.emailId,
    otp: otp,
    token: token,
  });

  await otpVerify
    .find({ emailId: req.params.emailId })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        return res.status(401).send({
          message: "User Not Found",
          success: false,
        });
      }
      const user = result[0];
      //   console.log(user);
      const decoded = jwt.verify(
        user.token,
        process.env.SECRET_KEY,
        function (err, decoded) {
          if (err) {
            // send via email
            otpVerify
              .findOneAndUpdate(
                { emailId: req.params.emailId },
                {
                  $set: {
                    emailId: req.params.emailId,
                    otp: otp,
                    token: token,
                  },
                }
              )
              .exec()
              .then((result) => {
                if (result == null || result.emailId !== req.params.emailId) {
                  otpData.save().then(() => {
                    try {
                      var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: "pandeprathamesh001@gmail.com",
                          pass: "mykejmibdbhmuuuz",
                        },
                      });

                      var mailOptions = {
                        from: "pandeprathamesh001@gmail.com",
                        to: req.params.emailId,
                        subject: "Notes Application Email Varification OTP",
                        html: `<html>
                  <body>
                  <h1>OTP👇 </h1>
                  <h2>OTP :- ${otp}</h2>
                  </body>
                  </html>`,
                      };

                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                        transporter.close();
                      });
                      res.send({
                        message: `Otp Send Successfully.. Valid For 5 min`,
                        success: true,
                        otpData: otpData,
                      });
                    } catch (error) {
                      res.send({
                        message: `Otp Not Send`,
                        success: false,
                      });
                    }
                  });
                } else {
                  try {
                    // send email code
                    var transporter = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: "pandeprathamesh001@gmail.com",
                        pass: "mykejmibdbhmuuuz",
                      },
                    });

                    var mailOptions = {
                      from: "pandeprathamesh001@gmail.com",
                      to: req.params.emailId,
                      subject: "Notes Application Email Varification OTP",
                      html: `<html>
                  <body>
                  <h1>OTP👇 </h1>
                  <h2>OTP :- ${otp}</h2>
                  </body>
                  </html>`,
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("Email sent: " + info.response);
                      }
                      transporter.close();
                    });
                    res.send({
                      message: "Updated otp send to user.. Valid for 5 min",
                      success: true,
                      otpData: otpData,
                    });
                  } catch (error) {
                    res.send({
                      message: `Otp Not Send`,
                      success: false,
                    });
                  }
                }
              });
          } else {
            res.status(201).send({
              message: "Privious Otp Is Valid Not Expired",
              success: false,
              otpData: user,
            });
          }
        }
      );
    });
};

export const otpVerification = async (req, res) => {
  const otp = req.params.otp;
  const emailId = req.params.emailId;
  //   otp valid or not using token
  // otp send via email
  // otp match send message
  await otpVerify
    .find({ emailId: req.params.emailId, otp: req.params.otp })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        return res.status(403).send({
          message: "Invalid EmailId Or OTP",
          success: false,
        });
      }
      const user = result[0];
      //   console.log(user);
      const decoded = jwt.verify(
        user.token,
        process.env.SECRET_KEY,
        function (err, decoded) {
          if (err) {
            res.send({
              message: "Token Experied",
              success: false,
            });
          } else {
            res.status(201).send({
              message: "Email Validation Successfully",
              success: true,
            });
          }
        }
      );
    });
};

// send mail code
export const forgetPassword = (req, res, next) => {
  const emailId = req.body.emailId;
  console.log(emailId);
  //   console.log(emailId);
  const userData = {
    emailId: emailId,
  };
  console.log(userData);
  const jwtToken = jwt.sign(
    {
      data: userData,
      // iat: Math.floor(Date.now() / 1000) - 30
    },
    process.env.SECRET_KEY,
    { expiresIn: "30m" }
  );

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pandeprathamesh001@gmail.com",
      pass: "mykejmibdbhmuuuz",
    },
  });

  var mailOptions = {
    from: "pandeprathamesh001@gmail.com",
    to: emailId,
    subject: "Rest Password",
    html: `<html>
    <style>
     .reset-button {
      display: block;
      width: 200px;
      margin: 20px auto;
      text-align: center;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 4px;
      font-weight: bold;
    }
    .reset-button:hover {
      background-color: #0056b3;
    }
    </style>
      <body>
      <h1>Reset Password</h1>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a type=button href='http://localhost:4200/reset-password/${jwtToken}'>Click Here</a>
      <p>If you didn’t request this, you can safely ignore this email. Your password will remain the same.</p>
      </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send({
        message: "Something went worong in Email sending",
        success: false,
      });
    } else {
      res.send({
        message: "Email Send On EmailId",
        success: true,
      });
      // console.log("Email sent: " + info.response);
    }
    transporter.close();
  });
};
