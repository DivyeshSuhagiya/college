const mongoose = require('mongoose')
const SALARY = mongoose.model('Salarys')

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
  exports.salary = {

      get: async function(req, res){
          try {
              const salary = await SALARY.find({})
              return successResponse(res, {
                  data: salary
                })

          } catch (error) {
              return errorResponse(error, req, res)

          }
      },
      getById: async function(req, res){
          try {
              const salaryInfo = await SALARY.findOne({
                _id: req.query.id,
              })
              if (!salaryInfo) {
                return badRequestResponse(res, {
                  message: 'salary not found',
                })
              }
              return successResponse(res, {
                data: salaryInfo,
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
      basicSalary:req.body.basicSalary,
      teacher_id:req.body.teacher_id,

      extraPay:req.body.extraPay,
      totalDays:req.body.totalDays,
      totalSalary:req.body.totalSalary,
      month:req.body.month,
      createdBy:req.user.email

    }
              const isCreated = await SALARY.create(a)
              if (isCreated) {
                return successResponse(res, {
                  message: 'salary created successfully',
                  data: isCreated
                })
              } else {
                return badRequestResponse(res, {
                  message: 'Failed to create salary',
                })
              }


          } catch (error) {
            return errorResponse(error, req, res)
          }
        },

      update: async function(req, res){
          try {

              const salaryInfo = await SALARY.findOne({
                  _id: req.body.id,
                })
                if (!salaryInfo) {
                  return badRequestResponse(res, {
                    message: 'salary not found',
                  })
                }
                await SALARY.findOneAndUpdate(
                  { _id: salaryInfo._id },
                  {
                    $set: {
                        basicSalary:req.body.basicSalary,
                        teacher_id:req.body.teacher_id,

                        extraPay:req.body.extraPay,
                        totalDays:req.body.totalDays,
                        totalSalary:req.body.totalSalary,
                        month:req.body.month,

                    },
                  },
                )
                return successResponse(res, {
                  message: 'salary updated successfully',
                  data:salaryInfo
                })
              } catch (error) {
                return errorResponse(error, req, res)
              }

          },
      delete: async function(req, res){
          try {
              const salaryInfo = await SALARY.findOne({
                _id: req.query.id,
              })
              if (!salaryInfo) {
                return badRequestResponse(res, {
                  message: 'salary not found',
                })
              }
              await SALARY.findByIdAndRemove({
                _id: salaryInfo._id,
              })
              return successResponse(res, {
                message: 'salary deleted successfully',
                data:salaryInfo
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }


      },

  }