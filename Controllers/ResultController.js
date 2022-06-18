const mongoose = require('mongoose')
const RESULT = mongoose.model('Results')

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
  exports.result = {

      get: async function(req, res){
          try {
              const result = await RESULT.find({})
              return successResponse(res, {
                  data: result
                })

          } catch (error) {
              return errorResponse(error, req, res)

          }
      },
      getById: async function(req, res){
          try {
              const resultInfo = await RESULT.findOne({
                _id: req.query.id,
              })
              if (!resultInfo) {
                return badRequestResponse(res, {
                  message: 'result not found',
                })
              }
              return successResponse(res, {
                data: resultInfo,
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
      scheduale_id:req.body.scheduale_id,
      passedStudents:req.body.passedStudents,
      failedStudents:req.body.failedStudents,
      resultDate:req.body.resultDate,
      resultGeneratedBy:req.user.email
    }
              const isCreated = await RESULT.create(a)
              if (isCreated) {
                return successResponse(res, {
                  message: 'result created successfully',
                  data: isCreated
                })
              } else {
                return badRequestResponse(res, {
                  message: 'Failed to create result',
                })
              }


          } catch (error) {
            return errorResponse(error, req, res)
          }
        },

      update: async function(req, res){
          try {

              const resultInfo = await RESULT.findOne({
                  _id: req.body.id,
                })
                if (!resultInfo) {
                  return badRequestResponse(res, {
                    message: 'result not found',
                  })
                }
                await RESULT.findOneAndUpdate(
                  { _id:resultInfo._id },
                  {
                    $set: {
                        scheduale_id:req.body.scheduale_id,
                        passedStudents:req.body.passedStudents,
                        failedStudents:req.body.failedStudents,
                        resultDate:req.body.resultDate
                    },
                  },
                )
                return successResponse(res, {
                  message: 'result updated successfully',
                  data:resultInfo
                })
              } catch (error) {
                return errorResponse(error, req, res)
              }

          },
      delete: async function(req, res){
          try {
              const resultInfo = await RESULT.findOne({
                _id: req.query.id,
              })
              if (!resultInfo) {
                return badRequestResponse(res, {
                  message: 'result not found',
                })
              }
              await RESULT.findByIdAndRemove({
                _id: resultInfo._id,
              })
              return successResponse(res, {
                message: 'result deleted successfully',
                data:resultInfo
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }


      },

  }