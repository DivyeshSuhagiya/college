const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const divisionController = require("../Controllers/DivisionController");


router.get('/get', (req, res) => divisionController.division.get(req, res))
router.delete('/delete', (req, res) => divisionController.division.delete(req, res))
router.post('/add', (req, res) => divisionController.division.add(req, res))
router.post('/update', (req, res) => divisionController.division.update(req, res))
router.get('/getById', (req, res) => divisionController.division.getById(req, res))

module.exports = router;