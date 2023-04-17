const controller = require('../../controllers/trades.controller');
const express = require('express');
const router = express.Router();

// Create a new trade
router.post('/create', controller.createTrade);

// Retrieve all trades
router.get('/all', controller.allGetTrades);

// Retrieve a single trade with id
router.get('/:id', controller.getTrade);

// Accept a trade from an id
router.post('/accept/:id', controller.acceptTrade)

// Reject a trade from an id
router.post('/reject/:id', controller.rejectTrade)

module.exports = router;
