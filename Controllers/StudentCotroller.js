const mongoose = require('mongoose')
const STUDENT = mongoose.model('students')

const {
  badRequestResponse,
  successResponse,
  notFoundResponse,
  errorResponse
} = require('../middleware/response')
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const cron = require('node-cron');


exports.student = {
  login: async (req, res) => {
    try {
      let studentInfo = await STUDENT.findOne({
        email: req.body.email
      });
      if (!studentInfo) {
        return notFoundResponse(res, {
          message: "Email not found!",
        });
      }
      if (!bcrypt.compareSync(req.body.password, studentInfo.password)) {
        return badRequestResponse(res, {
          message: "Authentication failed. Wrong password.",
        });
      }
      if (!studentInfo.isActive) {
        return badRequestResponse(res, {
          message:
            "Your account is deactivated, please activate your account from here",
          accountDeactive: true,
        });
      }
      var token = jwt.sign(studentInfo.toJSON(), process.env.secret, {
        expiresIn: "24h", // expires in 24 hours
      });
      return successResponse(res, {
        message: "You are logged in successfully!",
        token,
        studentInfo
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  register: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        email: req.body.email,
      });
      if (studentInfo) {
        return badRequestResponse(res, {
          message: "Email already exist!",
        });
      }
      if (req.body.password !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      const student = {
        // firstName: req.body.firstName,
        // lastName: req.body.lastName,
        // middleName:req.body.middleName,
        // idNumber:req.body.idNumber,
        // address:req.body.address,
        // pincode:req.body.pincode,
        // mobile:req.body.mobile,
        // aadharNumber:req.body.aadharNumber,
        email: req.body.email,
        password: req.body.password,
        isActive: false,
        // createdBy:req.body.createdBy
      };
      const otpCode = this.getOtpCode();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.gmailUserName,
          pass: process.env.gmailPassword,
        },
      });

      const emailSended = await transporter.sendMail({
        from: "Practice Math",
        to: req.body.email,
        subject: "Your otp",
        text: "Please activate your account in order to use the Practice App - Practice App",
        html: `Thank you signup with Practice App - Practice App. <br />Your account activation code is: ${otpCode}.`,
      });

      if (emailSended.accepted) {
        student.accountActivationCode = otpCode;
        var isCreated = STUDENT.create(student);
        if (isCreated) {
          let time = await STUDENT.findOne({
            email: req.body.email,
          })
          let dt = new Date(time.createdAt)
          let a = dt.getMinutes() + 2;

          console.log(dt.getMinutes())
          if (a == 60) {
            a = 0;
          }
          else if (a == 61) {
            a = 1;
          }
          console.log(a)

          cron.schedule(`${a} * * * *`, async () => {

            if (time.isActive !== false) {
              console.log(time.isActive)
              await STUDENT.findOneAndRemove({
                email: req.body.email,
              })
            }
            else {
              console.log(time.isActive)
            }
          })
          return successResponse(res, {
            message: "Student created!",
          });

        }
        else {
          return badRequestResponse(res, {
            message: "Failed to create Student",
          });
        }
      } else {
        return badRequestResponse(res, {
          message: "Failed to send account activation code",
        });
      }

    } catch (error) {
      return errorResponse(error, req, res);
    }



  },
  activatestudent: async function (req, res) {
    try {
      let studentInfo = await STUDENT.findOne({
        email: req.body.email,
      });
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: "Student not found!",
        });
      }
      if (studentInfo.accountActivationCode == req.body.accountActivationCode) {
        const isUpdated = await STUDENT.findOneAndUpdate(
          { _id: studentInfo._id },
          {
            $set: {
              isActive: true,
            },
          }
        );
        if (isUpdated) {
          return successResponse(res, {
            message: "Account activated successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to activate account",
          });
        }
      } else {
        return badRequestResponse(res, {
          message: "Please enter correct activation code",
          data: studentInfo.accountActivationCode
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  forgetPassword: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        email: req.body.email,
      });
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: "Student not found!",
        });
      }
      const otpCode = this.getOtpCode();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.gmailUserName,
          pass: process.env.gmailPassword,
        },
      });

      const emailSended = await transporter.sendMail({
        from: "Welders Math",
        to: req.body.email,
        subject: "Forget password",
        text: "We have received your forget password request",
        html: `Code: ${otpCode} <br />Otp code will be expired in 10 minutes`,
      });
      if (emailSended.accepted) {
        await STUDENT.findOneAndUpdate(
          { _id: studentInfo._id },
          {
            $set: {
              forgetPasswordOtp: otpCode,
              forgetPasswordOtpExpireTime: this.getOtpExpireTime(),
            },
          }
        );
        return successResponse(res, {
          message:
            "Forget password otp code send, please check your email account.",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to send otp code",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  get: async function (req, res) {
    try {
      const students = await STUDENT.find({})
      return successResponse(res, {
        data: students
      })

    } catch (error) {
      return errorResponse(error, req, res)

    }
  },
  getById: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        _id: req.query.id,
      })
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: 'Student not found',
        })
      }
      return successResponse(res, {
        data: studentInfo,
      })
    } catch (error) {
      return errorResponse(error, req, res)
    }
  },
  add: async function (req, res) {
    try {

      var token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.secret, async function (err, decoded) {
        if (err) {
          return res.status(401).json({
            message: "Auth token not found",
            error: err,
            isSuccess: false,
            data: token
          });
        } else {
          req.user = decoded;
        }
      });
      const isCreated = await STUDENT.findOneAndUpdate({ email: req.body.email }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        idNumber: req.body.idNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        mobile: req.body.mobile,
        aadharNumber: req.body.aadharNumber,
        email: req.body.email,
        createdBy: req.user.email
      })
      if (isCreated) {
        return successResponse(res, {
          message: 'Student created successfully',
          data: isCreated
        })
      } else {
        return badRequestResponse(res, {
          message: 'Failed to create student',
        })
      }


    } catch (error) {
      return errorResponse(error, req, res)
    }
  },
  verifyOtpCode: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        email: req.body.email,
      });
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: "User not found",
        });
      }
      if (!studentInfo.forgetPasswordOtp) {
        return badRequestResponse(res, {
          message: "Please send the request for forget password first",
        });
      }
      if (new Date(studentInfo.forgetPasswordOtpExpireTime) < new Date()) {
        return badRequestResponse(res, {
          message: "Otp code is expired, please send the code again",
        });
      }
      if (studentInfo.forgetPasswordOtp != req.body.otpCode) {
        return badRequestResponse(res, {
          message: "Otp code is invalid",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      studentInfo.password = req.body.newPassword;
      await STUDENT.findOneAndUpdate(
        { _id: studentInfo._id },
        {
          $set: {
            password: studentInfo.password,
            forgetPasswordOtp: null,
            forgetPasswordOtpExpireTime: null,
          },
        }
      );
      return successResponse(res, {
        message: "Password reset successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  changePassword: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        email: req.body.email,
      });
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: "Student not found",
        });
      }
      if (!bcrypt.compareSync(req.body.oldPassword, studentInfo.password)) {
        return badRequestResponse(res, {
          message: "Old password should be same as new password",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      studentInfo.password = req.body.newPassword;
      var isUpdated = await STUDENT.findOneAndUpdate(
        { _id: studentInfo._id },
        {
          $set: {
            password: studentInfo.password,
          },
        }
      );
      if (isUpdated) {
        return successResponse(res, {
          message: "Password changed successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to update password",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
  update: async function (req, res) {
    try {

      const studentInfo = await STUDENT.findOne({
        _id: req.body.id,
      })
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: 'Student not found',
        })
      }
      await STUDENT.findOneAndUpdate(
        { _id: studentInfo._id },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            idNumber: req.body.idNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            mobile: req.body.mobile,
            aadharNumber: req.body.aadharNumber,
            email: req.body.email,
            password: req.body.password
          },
        },
      )
      return successResponse(res, {
        message: 'Student updated successfully',
        data: studentInfo
      })
    } catch (error) {
      return errorResponse(error, req, res)
    }

  },
  delete: async function (req, res) {
    try {
      const studentInfo = await STUDENT.findOne({
        _id: req.query.id,
      })
      if (!studentInfo) {
        return badRequestResponse(res, {
          message: 'Student not found',
        })
      }
      await STUDENT.findByIdAndRemove({
        _id: studentInfo._id,
      })
      return successResponse(res, {
        message: 'Student deleted successfully',
        data: studentInfo
      })
    } catch (error) {
      return errorResponse(error, req, res)
    }


  },
  getOtpCode: function () {
    return parseFloat(
      `${Math.ceil(Math.random() * 5 * 100000)}`.padEnd(6, "0")
    );
  },
  getOtpExpireTime: function () {
    return new Date(new Date().getTime() + 10 * 60000);
  },
}
