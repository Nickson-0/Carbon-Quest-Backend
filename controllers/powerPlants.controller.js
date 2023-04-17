const PowerPlant = require('../models/powerPlants.model');
const User = require('../models/users.model');

// Create the new PowerPlant
exports.createPowerPlant = async (req, res) => {
  try {
    const powerPlant = await PowerPlant.create({
      type: req.body.type,
      fuelType: req.body.fuelType,
      energyProduction: req.body.energyProduction,
      co2Production: req.body.co2Production,
      fuelAmount: req.body.fuelAmount,
      price: req.body.price,
    });
    res.status(201).json({ powerPlant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve all the PowerPlants
exports.getAllPowerPlants = async (req, res) => {
  try {
    const powerPlants = await PowerPlant.find();
    res.status(200).json({ powerPlants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve a single PowerPlant by ID
exports.getPowerPlantById = async (req, res) => {
  const { id } = req.params;
  try {
    const powerPlant = await PowerPlant.findById(id);
    if (!powerPlant) {
      return res.status(404).json({ message: 'PowerPlant not found' });
    }
    res.status(200).json({ powerPlant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a PowerPlant by ID
exports.updatePowerPlantById = async (req, res) => {
  const { id } = req.params;
  const { type, fuelType, energyProduction, co2Production, fuelAmount, price } =
    req.body;

  try {
    const powerPlant = await PowerPlant.findByIdAndUpdate(
      id,
      {
        type,
        fuelType,
        energyProduction,
        co2Production,
        fuelAmount,
        price,
      },
      { new: true }
    );
    if (!powerPlant) {
      return res.status(404).json({ message: 'PowerPlant not found' });
    }
    res.status(200).json({ powerPlant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a PowerPlant by ID
exports.deletePowerPlantById = async (req, res) => {
  const { id } = req.params;
  try {
    const powerPlant = await PowerPlant.findByIdAndDelete(id);
    if (!powerPlant) {
      return res.status(404).json({ message: 'PowerPlant not found' });
    }
    res.status(200).json({ message: 'PowerPlant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buy the PowerPlant
exports.buyPowerPlant = async (req, res) => {
  const { userId, powerPlantId } = req.body;

  try {
    const powerPlant = await PowerPlant.findById(powerPlantId);

    if (!powerPlant) {
      return res.status(404).json({ message: 'Power plant not found' });
    }

    const user = await User.findById(userId);

    if (user.money < powerPlant.price) {
      return res.status(400).json({ message: 'Not enough money' });
    }

    user.money -= powerPlant.price;
    let index = -1;
    for (let i = 0; i < user.powerPlants.length; i++) {
      if (user.powerPlants[i].powerPlant_id.equals(powerPlant.id)) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      user.powerPlants[index] = {
        ...JSON.parse(JSON.stringify(user.powerPlants[index])),
        count: user.powerPlants[index].count + 1,
      };
    } else {
      user.powerPlants.push({
        powerPlant_id: powerPlant.id,
      });
    }

    await user.save();
    res.json({ message: 'Power plant purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePowerPlant = async (req, res) => {
  const { userId, powerPlantId, countValue } = req.body;

  try {
    const powerPlant = await PowerPlant.findById(powerPlantId);

    if (!powerPlant) {
      return res.status(404).json({ message: 'Power plant not found' });
    }

    const user = await User.findById(userId);

    let value = 0;
    if (powerPlant.co2Production != 0) {
      user.co2Production += powerPlant.co2Production * countValue;
      value = user.resources.nonRenewable[powerPlant.fuelType];
      user.resources.nonRenewable[powerPlant.fuelType] =
        value - countValue * 25;
    } else {
      if (powerPlant.fuelType == 'uranium') {
        value = user.resources.nonRenewable[powerPlant.fuelType];
        user.resources.nonRenewable[powerPlant.fuelType] =
          value - countValue * 25;
      }
      value = user.resources.renewable[powerPlant.fuelType];
      user.resources.renewable[powerPlant.fuelType] = value - countValue * 25;
    }
    user.energyProduction += powerPlant.energyProduction * countValue;

    await user.save();
    res.status(200).json({ message: 'Fuel Card purchased successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
