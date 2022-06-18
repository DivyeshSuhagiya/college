"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var ResultSchema = new mongoose.Schema(
    {

        scheduale_id: {
            type: Number,
            required: true,
            trim: true,

        },
        passedStudents: {
            type: String,
            required: true,
            trim: true,
        },
        failedStudents:{
            type: String,
            required: true,
            trim: true,
        },
        resultDate: {
            type: Date,
            default: false,
        },

        resultGeneratedBy: {
            type: String,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);



var Result = mongoose.model("Results", ResultSchema);
module.exports = Result;
