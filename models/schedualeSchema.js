"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var SchedualeSchema = new mongoose.Schema(
    {

        division_id: {
            type: Number,
            required: true,
            unique: true,
            trim: true,

        },
        subjectName: {
            type: String,
            default:"",
            trim: true,
        },
        fromTime: {
            type: String,
            default:"",
            trim: true,
        },
        toTime: {
            type: String,
            default:"",
            trim: true,
        },
        examDate: {
            type: Date,
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



var Scheduale = mongoose.model("Scheduales", SchedualeSchema);
module.exports = Scheduale;
