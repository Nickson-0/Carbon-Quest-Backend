const Room = require('../models/room.model');
const User = require('../models/users.model');

// CREATE a new room
exports.createRoom = async (req, res) => {
  const roomId = req.body.roomId;
  const password = req.body.password;
  const username = req.body.username;
  try {
    const user = await User.findOne({ username: username });
    const roomTable = await Room.findOne({ roomName: roomId });
    if (roomTable) {
      return res.status(404).json({ message: 'Room Name is already exist' });
    }
    user.roomId = roomId;
    user.flag = 1;
    user.readyState = false;
    const room = await Room.create({
      roomName: roomId,
      password: password,
    });

    await room.save();
    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error!' });
  }
};

exports.joinRoom = async (req, res) => {
  const roomId = req.body.roomId;
  const password = req.body.password;
  const username = req.body.username;
  try {
    const room = await Room.findOne({ roomName: roomId });
    const user = await User.findOne({ username: username });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.password != password) {
      return res.status(404).json({ message: 'Password not correct' });
    }
    if (room.status !== 'pending') {
      return res.status(404).json({ message: 'Room is not exist' });
    }
    user.roomId = roomId;
    user.readyState = false;
    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error!' });
  }
};

// Retrieve all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Retrieve room by id
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    return res.status(200).json({ room });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
