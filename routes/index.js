const express = require('express');
const router = express.Router();
const userRouter = require('./api/userRouter');
const tradesRouter = require('./api/tradesRouter');
const powerPlantsRouter = require('./api/powerPlantsRouter');
const fuelingRouter = require('./api/fuelingRouter');
const roomRouter = require('./api/roomRouter');

router.use('/user', userRouter);
router.use('/trades', tradesRouter);
router.use('/powerPlants', powerPlantsRouter);
router.use('/fueling', fuelingRouter);
router.use('/room', roomRouter);

module.exports = router;
