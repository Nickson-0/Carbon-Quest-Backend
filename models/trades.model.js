// Require Mongoose
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: function (v) {
        return this.senderId !== v;
      },
      message: (props) => 'The sender and recipient cannot be the same user',
    },
  },
  senderResources: [
    {
      resource: {
        type: String,
        enum: [
          'oil',
          'coal',
          'gas',
          'uranium',
          'solar',
          'geoThermal',
          'wind',
          'hydro',
        ],
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  recipientResources: [
    {
      resource: {
        type: String,
        enum: [
          'oil',
          'coal',
          'gas',
          'uranium',
          'solar',
          'geoThermal',
          'wind',
          'hydro',
        ],
        required: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  senderMoney: {
    type: Number,
    default: 0,
  },
  recipientMoney: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
