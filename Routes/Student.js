const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const studentController = require("../Controllers/StudentCotroller");

router.post('/login', (req, res) => studentController.student.login(req, res))

router.post('/register', (req, res) => studentController.student.register(req, res))

router.post('/activatestudent', (req, res) => studentController.student.activatestudent(req, res))

router.post('/forgetPassword', (req, res) => studentController.student.forgetPassword(req, res))

router.post('/verifyOtpCode', (req, res) => studentController.student.verifyOtpCode(req, res))

router.post('/changePassword', (req, res) => studentController.student.changePassword(req, res))
router.get('/get',ensureAuthorized, (req, res) => studentController.student.get(req, res))
router.delete('/delete',ensureAuthorized, (req, res) => studentController.student.delete(req, res))
router.post('/add',ensureAuthorized, (req, res) => studentController.student.add(req, res))
router.post('/update',ensureAuthorized, (req, res) => studentController.student.update(req, res))
router.get('/getById',ensureAuthorized, (req, res) => studentController.student.getById(req, res))

module.exports = router;