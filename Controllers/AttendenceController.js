const mongoose = require('mongoose')
const ATTENDANCE = mongoose.model('Attendances')

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
  exports.attendance = {

      get: async function(req, res){
          try {
              const attendance = await ATTENDANCE.find({})
              return successResponse(res, {
                  data: attendance
                })

          } catch (error) {
              return errorResponse(error, req, res)

          }
      },
      getById: async function(req, res){
          try {
              const attendanceInfo = await ATTENDANCE.findOne({
                _id: req.query.id,
              })
              if (!attendanceInfo) {
                return badRequestResponse(res, {
                  message: 'attendance not found',
                })
              }
              return successResponse(res, {
                data: attendanceInfo,
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }
      },
      add : async function (req, res) {
          try {

            var token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.secret, async function (err, decoded) {
              if (err) {
                  return res.status(401).json({
                      message: "Auth token not found",
                      error: err,
                      isSuccess: false,
                      data:token
                  });
              } else {
                  req.user = decoded;
              }
          });
    const a={
      student_id:req.body.student_id,
      teacher_id:req.body.teacher_id,

      date:req.body.date,
      isPresent:req.body.isPresent,
      remark:req.body.remark,
      attendanceType:req.body.attendanceType,
      attendanceTakenBy:req.user.email
    }
              const isCreated = await ATTENDANCE.create(a)
              if (isCreated) {
                return successResponse(res, {
                  message: 'attendance created successfully',
                  data: isCreated
                })
              } else {
                return badRequestResponse(res, {
                  message: 'Failed to create attendance',
                })
              }


          } catch (error) {
            return errorResponse(error, req, res)
          }
        },

      update: async function(req, res){
          try {

              const attendanceInfo = await ATTENDANCE.findOne({
                  _id: req.body.id,
                })
                if (!attendanceInfo) {
                  return badRequestResponse(res, {
                    message: 'attendance not found',
                  })
                }
                await ATTENDANCE.findOneAndUpdate(
                  { _id: attendanceInfo._id },
                  {
                    $set: {
                        student_id:req.body.student_id,
                        teacher_id:req.body.teacher_id,

                        date:req.body.date,
                        isPresent:req.body.isPresent,
                        remark:req.body.remark,
                        attendanceType:req.body.attendanceType,


                    },
                  },
                )
                return successResponse(res, {
                  message: 'attendance updated successfully',
                  data:attendanceInfo
                })
              } catch (error) {
                return errorResponse(error, req, res)
              }

          },
      delete: async function(req, res){
          try {
              const attendanceInfo = await ATTENDANCE.findOne({
                _id: req.query.id,
              })
              if (!attendanceInfo) {
                return badRequestResponse(res, {
                  message: 'attendance not found',
                })
              }
              await ATTENDANCE.findByIdAndRemove({
                _id: attendanceInfo._id,
              })
              return successResponse(res, {
                message: 'attendance deleted successfully',
                data:attendanceInfo
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }


      },

  }