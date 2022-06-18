"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var SalarySchema = new mongoose.Schema(
    {

        teacher_id: {
            type: Number,
            required: true,

            trim: true,

        },
        basicSalary: {
            type: Number,
            required: true,
            trim: true,
        },
        extraPay:{
            type: Number,
            default:0,
            trim: true,
        },
        totalDays:{
            type: Number,
            default:0,
            trim: true,
        },
        totalSalary:{
            type: Number,
            default:0,
            trim: true,
        },
        month:{
            type: String,
            default:"",
            trim: true,
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



var Salary = mongoose.model("Salarys", SalarySchema);
module.exports = Salary;
