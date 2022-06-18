"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var StudentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            default: "",
            trim: true,
        },
        lastName: {
            type: String,
            default: "",
            trim: true,
        },
        middleName: {
            type: String,
            default: "",
            trim: true,
        },
        idNumber: {
            type: Number,
            default: "",
            trim: true,
        },
        address: {
            type: String,
            default: "",
            trim: true,
        },
        pincode: {
            type: Number,
            default: "",
            trim: true,
        },
        mobile: {
            type: Number,
            default: "",
            trim: true,
        },
        aadharNumber: {
            type: Number,
            default: "",
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            default: false,
        },
        forgetPasswordOtp: {
            type: Number,
        },
        forgetPasswordOtpExpireTime: {
            type: Date,
        },
        accountActivationCode: {
          type: String,
      },
        createdBy: {
            type: String,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);
StudentSchema.index({ email: 1 });

StudentSchema.pre("save", function (next) {
  var Student = this;
  if (!Student.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(Student.password, salt, function (err, hash) {
      if (err) return next(err);
      Student.password = hash;
      next();
    });
  });
});

StudentSchema.pre("findOneAndUpdate", function (next) {
  const Student = this.getUpdate().$set;
  if (!Student.password) {
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(Student.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        Student.password = hash;
        next();
      });
    });
  }
});

StudentSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
var student = mongoose.model("students", StudentSchema);
module.exports = student;
