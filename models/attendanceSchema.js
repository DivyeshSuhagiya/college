"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var AttendanceSchema = new mongoose.Schema(
    {

        student_id: {
            type: Number,

            trim: true,

        },
        teacher_id: {
            type: Number,

            trim: true,
        },
        date:{
            type: Date,
            required: true,
            trim: true,
        },
        isPresent:{
            type: Boolean,
            required: true,
            trim: true,
        },
        remark:{
            type: String,
            required: true,
            trim: true,
        },
        attendanceType:{
            type: String,
            required: true,
            trim: true,
        },
        attendanceTakenBy: {
            type: String,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);



var Attendance = mongoose.model("Attendances", AttendanceSchema);
module.exports = Attendance;
