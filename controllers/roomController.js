const User = require('../models/users.model');

const getUserByRoom = async (req) => {
  const roomId = req.roomId;
  try {
    const array = await User.find({ roomId: roomId });
    return { code: 200, data: array };
  } catch (error) {
    return { code: 500, message: 'Something went wrong' };
  }
};

const getFinalUser = async (req) => {
  const roomId = req.id;
  try {
    const array = await User.find({ roomId: roomId });
    return { code: 200, data: array };
  } catch (error) {
    return { code: 500, message: 'Something went wrong' };
  }
};

const modifyRoom = async (req) => {
  const roomId = req.id;
  const username = req.name;
  try {
    const user = await User.findOne({ username: username });
    user.readyState = !user.readyState;
    await user.save();
    const array = await User.find({ roomId: roomId });
    return { code: 200, data: array };
  } catch (error) {
    return { code: 500, message: 'Something went wrong!' };
  }
};

module.exports = {
  getUserByRoom,
  getFinalUser,
  modifyRoom,
};
