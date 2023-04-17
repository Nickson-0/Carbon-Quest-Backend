// Require Mongoose
const mongoose = require('mongoose');

const resourceTokenSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['nonRenewableResources', 'renewableResources'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ResourceToken = mongoose.model('ResourceToken', resourceTokenSchema);

module.exports = ResourceToken;
