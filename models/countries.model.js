// Require Mongoose
const mongoose = require('mongoose');

const CountriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Country', ContriesSchema);
