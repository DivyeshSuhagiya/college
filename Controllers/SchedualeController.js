const mongoose = require('mongoose')
const SCHEDUALE = mongoose.model('Scheduales')

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
  exports.scheduale = {

      get: async function(req, res){
          try {
              const scheduale = await SCHEDUALE.find({})
              return successResponse(res, {
                  data: scheduale
                })

          } catch (error) {
              return errorResponse(error, req, res)

          }
      },
      getById: async function(req, res){
          try {
              const schedualeInfo = await SCHEDUALE.findOne({
                _id: req.query.id,
              })
              if (!schedualeInfo) {
                return badRequestResponse(res, {
                  message: 'scheduale not found',
                })
              }
              return successResponse(res, {
                data: schedualeInfo,
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
      division_id:req.body.division_id,
      subjectName:req.body.subjectName,
      fromTime:req.body.fromTime,
      toTime:req.body.toTime,
      examDate:req.body.examDate,
      createdBy:req.user.eamil
    }
              const isCreated = await SCHEDUALE.create(a)
              if (isCreated) {
                return successResponse(res, {
                  message: 'scheduale created successfully',
                  data: isCreated
                })
              } else {
                return badRequestResponse(res, {
                  message: 'Failed to create scheduale',
                })
              }


          } catch (error) {
            return errorResponse(error, req, res)
          }
        },

      update: async function(req, res){
          try {

              const schedualeInfo = await SCHEDUALE.findOne({
                  _id: req.body.id,
                })
                if (!schedualeInfo) {
                  return badRequestResponse(res, {
                    message: 'scheduale not found',
                  })
                }
                await SCHEDUALE.findOneAndUpdate(
                  { _id: schedualeInfo._id },
                  {
                    $set: {
                      division_id:req.body.division_id,
      subjectName:req.body.subjectName,
      fromTime:req.body.fromTime,
      toTime:req.body.toTime,
      examDate:req.body.examDate

                    },
                  },
                )
                return successResponse(res, {
                  message: 'scheduale updated successfully',
                  data:schedualeInfo
                })
              } catch (error) {
                return errorResponse(error, req, res)
              }

          },
      delete: async function(req, res){
          try {
              const schedualeInfo = await SCHEDUALE.findOne({
                _id: req.query.id,
              })
              if (!schedualeInfo) {
                return badRequestResponse(res, {
                  message: 'scheduale not found',
                })
              }
              await SCHEDUALE.findByIdAndRemove({
                _id: schedualeInfo._id,
              })
              return successResponse(res, {
                message: 'scheduale deleted successfully',
                data:schedualeInfo
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }


      },

  }