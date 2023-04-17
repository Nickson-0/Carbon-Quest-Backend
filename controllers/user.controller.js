const User = require('../models/users.model');
const userConfig = require('./config/user.config');

// CREATE a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      resources: userConfig.resources,
      money: userConfig.money,
      roomId: req.body.roomId,
      country: req.body.position,
    });
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change a user by money
exports.changeUser = async (req, res) => {
  try {
    let user = await User.findById(req.body._id);
    user.money = req.body.money;
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve users by Room_Id
exports.getUsersByRoomId = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.find({ room_id: id });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a single user by ID
exports.getUserById = async (req, res) => {
  const { data } = req.params;
  try {
    let user = {};
    switch (typeof data) {
      case 'string':
        user =
          data.length > 15
            ? await User.findById(data)
            : await User.findOne({ username: data });
        break;
      case 'number':
        user = await User.findOne({ room_id: data });
        break;
      default:
        break;
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE a user by ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const {
    resources,
    powerPlants,
    money,
    co2Production,
    characterIcon,
    energyProduction,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        resources,
        powerPlants,
        money,
        co2Production,
        characterIcon,
        energyProduction,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE user's resources
exports.updateResources = async (req, res) => {
  const userId = req.params.id;
  const { nonRenewable, renewable } = req.body;

  try {
    const user = await User.findById(userId);

    if (nonRenewable) {
      for (const resource in nonRenewable) {
        user.resources.nonRenewable[resource] += nonRenewable[resource];
      }
    }

    if (renewable) {
      for (const resource in renewable) {
        user.resources.renewable[resource] += renewable[resource];
      }
    }

    await user.save();
    res.status(200).json({ message: 'Resources updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE user's power plants
exports.updatePowerPlants = async (req, res) => {
  const userId = req.params.id;
  const powerPlants = req.body;

  try {
    const user = await User.findById(userId);

    for (const type in powerPlants) {
      user.powerPlants[type].count += powerPlants[type];
    }

    await user.save();
    res.status(200).json({ message: 'Power plants updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CALC the EnergyProduction
exports.calculateEnergyProduction = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    let totalEnergyProduction = 0;

    for (const type in user.powerPlants) {
      const powerPlant = user.powerPlants[type];
      totalEnergyProduction +=
        powerPlant.count * powerPlant.energyProductionRate;
    }

    res.status(200).json({ totalEnergyProduction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CALC the Co2Production
exports.calculateCo2Production = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    let totalCo2Production = 0;

    for (const type in user.powerPlants) {
      const powerPlant = user.powerPlants[type];
      totalCo2Production += powerPlant.count * powerPlant.co2ProductionRate;
    }

    res.status(200).json({ totalCo2Production });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
