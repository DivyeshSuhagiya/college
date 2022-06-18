const express = require('express')
const { ensureAuthorized } = require('../middleware/auth')
const router = express.Router()

const studentRoutes = require('./Student')
// const { ensureAuthorized } = require('../middlewasre/auth')

const teacherRoutes = require('./Teacher')
const adminRoutes = require('./Admin')
const divisionRoutes = require('./Division')
const attendanceRoutes = require('./Attendance')
const resultRoutes = require('./Result')
const salaryRoutes = require('./Salary')
const schedualeRoutes = require('./Sheduale')

router.use('/student', studentRoutes)
router.use('/teacher', teacherRoutes)
router.use('/admin', adminRoutes)
router.use('/division',ensureAuthorized, divisionRoutes)
router.use('/attendance',ensureAuthorized, attendanceRoutes)
router.use('/result',ensureAuthorized, resultRoutes)
router.use('/salary',ensureAuthorized, salaryRoutes)
router.use('/scheduale',ensureAuthorized, schedualeRoutes)



module.exports = router