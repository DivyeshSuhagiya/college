const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const salaryController = require("../Controllers/SalaryController");


router.get('/get', (req, res) => salaryController.salary.get(req, res))
router.delete('/delete', (req, res) => salaryController.salary.delete(req, res))
router.post('/add', (req, res) => salaryController.salary.add(req, res))
router.post('/update', (req, res) => salaryController.salary.update(req, res))
router.get('/getById', (req, res) => salaryController.salary.getById(req, res))

module.exports = router;