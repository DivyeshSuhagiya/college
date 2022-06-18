"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var AdminSchema = new mongoose.Schema(
    {

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
AdminSchema.index({ email: 1 });

AdminSchema.pre("save", function (next) {
  var Admin = this;
  if (!Admin.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(Admin.password, salt, function (err, hash) {
      if (err) return next(err);
      Admin.password = hash;
      next();
    });
  });
});

AdminSchema.pre("findOneAndUpdate", function (next) {
  const Admin = this.getUpdate().$set;
  if (!Admin.password) {
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(Admin.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        Admin.password = hash;
        next();
      });
    });
  }
});

AdminSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
var admin = mongoose.model("admins", AdminSchema);
module.exports = admin;
