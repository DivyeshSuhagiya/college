const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require('../middleware/auth')

const schedualeController = require("../Controllers/SchedualeController");


router.get('/get', (req, res) => schedualeController.scheduale.get(req, res))
router.delete('/delete', (req, res) => schedualeController.scheduale.delete(req, res))
router.post('/add', (req, res) => schedualeController.scheduale.add(req, res))
router.post('/update', (req, res) => schedualeController.scheduale.update(req, res))
router.get('/getById', (req, res) => schedualeController.scheduale.getById(req, res))

module.exports = router;