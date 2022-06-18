const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const adminController = require("../Controllers/AdminController");

router.post('/login', (req, res) => adminController.admin.login(req, res))

router.post('/register', (req, res) => adminController.admin.register(req, res))

router.post('/activateAdmin', (req, res) => adminController.admin.activateAdmin(req, res))

router.post('/forgetPassword', (req, res) => adminController.admin.forgetPassword(req, res))

router.post('/verifyOtpCode', (req, res) => adminController.admin.verifyOtpCode(req, res))

router.post('/changePassword', (req, res) => adminController.admin.changePassword(req, res))

module.exports = router;