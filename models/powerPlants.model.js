// Require Mongoose
const mongoose = require('mongoose');

const powerPlantSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'Oil-fired Plant',
      'Coal-fired Plant',
      'Gas-fired Plant',
      'Geo-Turbine',
      'Nuclear Plant',
      'Solar Panel',
      'Wind Turbine',
      'Electric Dam',
    ],
    required: true,
  },
  fuelType: {
    type: String,
    enum: [
      'uranium',
      'solar',
      'geoThermal',
      'hydro',
      'wind',
      'gas',
      'coal',
      'oil',
    ],
    require: true,
  },
  energyProduction: {
    type: Number,
    required: true,
  },
  co2Production: {
    type: Number,
    required: true,
  },
  fuelAmount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PowerPlant = mongoose.model('PowerPlant', powerPlantSchema);

module.exports = PowerPlant;
