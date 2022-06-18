const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const teacherController = require("../Controllers/TeacherController");

router.post('/login', (req, res) => teacherController.teacher.login(req, res))

router.post('/register', (req, res) => teacherController.teacher.register(req, res))

router.post('/activateTeacher', (req, res) => teacherController.teacher.activateTeacher(req, res))

router.post('/forgetPassword', (req, res) => teacherController.teacher.forgetPassword(req, res))

router.post('/verifyOtpCode', (req, res) => teacherController.teacher.verifyOtpCode(req, res))

router.post('/changePassword', (req, res) => teacherController.teacher.changePassword(req, res))
router.get('/get',ensureAuthorized, (req, res) => teacherController.teacher.get(req, res))
router.delete('/delete',ensureAuthorized, (req, res) => teacherController.teacher.delete(req, res))
router.post('/add',ensureAuthorized, (req, res) => teacherController.teacher.add(req, res))
router.post('/update',ensureAuthorized, (req, res) => teacherController.teacher.update(req, res))
router.get('/getById',ensureAuthorized, (req, res) => teacherController.teacher.getById(req, res))

module.exports = router;