const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const attendanceController = require("../Controllers/AttendenceController");


router.get('/get', (req, res) => attendanceController.attendance.get(req, res))
router.delete('/delete', (req, res) => attendanceController.attendance.delete(req, res))
router.post('/add', (req, res) => attendanceController.attendance.add(req, res))
router.post('/update', (req, res) => attendanceController.attendance.update(req, res))
router.get('/getById', (req, res) => attendanceController.attendance.getById(req, res))

module.exports = router;