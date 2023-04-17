// Require Mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: 'default-icon.png',
  },
  roomId: {
    type: String,
    ref: 'Room',
    default: -1,
  },
  flag: {
    type: String,
    enum: [0, 1],
    default: 0,
  },
  readyState: {
    type: Boolean,
    default: false,
  },
  resources: {
    nonRenewable: {
      oil: {
        type: Number,
        default: 0,
      },
      coal: {
        type: Number,
        default: 0,
      },
      gas: {
        type: Number,
        default: 0,
      },
      uranium: {
        type: Number,
        default: 0,
      },
    },
    renewable: {
      solar: {
        type: Number,
        default: 0,
      },
      geoThermal: {
        type: Number,
        default: 0,
      },
      wind: {
        type: Number,
        default: 0,
      },
      hydro: {
        type: Number,
        default: 0,
      },
    },
  },
  powerPlants: [
    {
      powerPlant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PowerPlant',
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
  money: {
    type: Number,
    default: 0,
  },
  energyProduction: {
    type: Number,
    default: 0,
  },
  co2Production: {
    type: Number,
    default: 0,
  },
  country: {
    positionX: {
      type: Number,
      default: 0,
    },
    positionY: {
      type: Number,
      default: 0,
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
