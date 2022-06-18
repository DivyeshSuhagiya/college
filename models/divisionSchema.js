"use strict";
var mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const { string } = require("joi");
const SALT_WORK_FACTOR = 10;
var DivisionSchema = new mongoose.Schema(
    {

        division_id: {
            type: Number,
            required: true,
            unique: true,
            trim: true,

        },
        class: {
            type: String,
            required: true,
            trim: true,
        },
        section:{
            type: String,
            required: true,
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



var Division = mongoose.model("Divisions", DivisionSchema);
module.exports = Division;
