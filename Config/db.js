'use strict'
let mongoose = require('mongoose')

require('../models/studentSchema')
require('../models/teacherSchema')
require('../models/adminSchema')
require('../models/divisionSchema')
require('../models/attendanceSchema')
require('../models/resultSchema')
require('../models/salarySchema')
require('../models/schedualeSchema')



mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc)
})
mongoose.Promise = global.Promise

mongoose.connect(process.env.connectionString, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection failed'))

db.once('open', function () {
  console.log('Database connected successfully!')
})
