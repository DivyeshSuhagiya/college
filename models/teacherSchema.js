"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
var TeacherSchema = new mongoose.Schema(
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
        experience: {
            type: String,
            default: false,
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
TeacherSchema.index({ email: 1 });

TeacherSchema.pre("save", function (next) {
  var Teacher = this;
  if (!Teacher.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(Teacher.password, salt, function (err, hash) {
      if (err) return next(err);
      Teacher.password = hash;
      next();
    });
  });
});

TeacherSchema.pre("findOneAndUpdate", function (next) {
  const Teacher = this.getUpdate().$set;
  if (!Teacher.password) {
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(Teacher.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        Teacher.password = hash;
        next();
      });
    });
  }
});

TeacherSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
var teacher = mongoose.model("teachers", TeacherSchema);
module.exports = teacher;
