// Require Mongoose
const mongoose = require('mongoose');

const FuelingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  powerPlant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PowerPlant',
    required: true,
  },
  powerPlantCount: {
    type: Number,
    required: true,
  },
  fuelAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Fueling', FuelingSchema);
