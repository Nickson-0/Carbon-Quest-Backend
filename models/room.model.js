// Require Mongoose
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'start', 'end'],
    default: 'pending',
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
