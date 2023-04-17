const controller = require('../../controllers/room.controller');
const express = require('express');
const router = express.Router();

// Create a new room
router.post('/create', controller.createRoom);

router.post('/get', controller.joinRoom);

// Retrieve all rooms
router.get('/all', controller.getAllRooms);

// Retrieve a single room by id
router.get('/:id', controller.getRoomById);

module.exports = router;
