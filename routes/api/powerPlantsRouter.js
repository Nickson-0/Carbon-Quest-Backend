const controller = require('../../controllers/powerPlants.controller');
const express = require('express');
const router = express.Router();

// Create the new PowerPlant
router.post('/create', controller.createPowerPlant);

// Retrieve all PowerPlants
router.get('/all', controller.getAllPowerPlants);

// Retrieve a single PowerPlant with id
router.get('/:id', controller.getPowerPlantById);

// Update a PowerPlant with id
router.put('/:id', controller.updatePowerPlantById);

// Delete a PowerPlant with id
router.delete('/:id', controller.deletePowerPlantById);

// Buy the PowerPlant
router.post('/buy', controller.buyPowerPlant);

// Update the PowerPlant
router.post('/update', controller.updatePowerPlant);

module.exports = router;
