const mongoose = require('mongoose')
const DIVISION = mongoose.model('Divisions')

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
  exports.division = {

      get: async function(req, res){
          try {
              const divisions = await DIVISION.find({})
              return successResponse(res, {
                  data: divisions
                })

          } catch (error) {
              return errorResponse(error, req, res)

          }
      },
      getById: async function(req, res){
          try {
              const divisionInfo = await DIVISION.findOne({
                _id: req.query.id,
              })
              if (!divisionInfo) {
                return badRequestResponse(res, {
                  message: 'division not found',
                })
              }
              return successResponse(res, {
                data: divisionInfo,
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
      class:req.body.class,
      section:req.body.section,
      createdBy:req.user.email
    }
              const isCreated = await DIVISION.create(a)
              if (isCreated) {
                return successResponse(res, {
                  message: 'division created successfully',
                  data: isCreated
                })
              } else {
                return badRequestResponse(res, {
                  message: 'Failed to create division',
                })
              }


          } catch (error) {
            return errorResponse(error, req, res)
          }
        },

      update: async function(req, res){
          try {

              const divisionInfo = await DIVISION.findOne({
                  _id: req.body.id,
                })
                if (!divisionInfo) {
                  return badRequestResponse(res, {
                    message: 'division not found',
                  })
                }
                await DIVISION.findOneAndUpdate(
                  { _id: divisionInfo._id },
                  {
                    $set: {
                      division_id:req.body.division_id,
                      class:req.body.class,
                      section:req.body.section

                    },
                  },
                )
                return successResponse(res, {
                  message: 'division updated successfully',
                  data:divisionInfo
                })
              } catch (error) {
                return errorResponse(error, req, res)
              }

          },
      delete: async function(req, res){
          try {
              const divisionInfo = await DIVISION.findOne({
                _id: req.query.id,
              })
              if (!divisionInfo) {
                return badRequestResponse(res, {
                  message: 'division not found',
                })
              }
              await DIVISION.findByIdAndRemove({
                _id: divisionInfo._id,
              })
              return successResponse(res, {
                message: 'division deleted successfully',
                data:divisionInfo
              })
            } catch (error) {
              return errorResponse(error, req, res)
            }


      },

  }