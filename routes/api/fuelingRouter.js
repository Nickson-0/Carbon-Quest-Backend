const controller = require('../../controllers/fueling.controller');
const express = require('express');
const router = express.Router();

// Create the fuel
router.post('/fuel', controller.fuelPowerPlant);

module.exports = router;
