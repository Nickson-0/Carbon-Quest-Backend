const controller = require('../../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Create a new User
router.post('/create', controller.createUser);

// Change a User Money
router.post('/money', controller.changeUser);

// Retrieve all Users
router.get('/all', controller.getAllUsers);

// Retrieve a single User with id
router.get('/:data', controller.getUserById);

// Retrieve all User with room_id
router.get('/room/:id', controller.getUsersByRoomId);

// Retrieve a single User's EnergyProduction with id
router.get('/energy/:id', controller.calculateEnergyProduction);

// Retrieve a single User's Co2Production with id
router.get('/co2/:id', controller.calculateCo2Production);

// Update a User with id
router.put('/:id', controller.updateUserById);

// Update a User's Resources with id
router.put('/resources/:id', controller.updateResources);

// Update a User's PowerPlant with id
router.put('/powerplant/:id', controller.updatePowerPlants);

// Delete a User with id
router.delete('/:id', controller.deleteUserById);

module.exports = router;
