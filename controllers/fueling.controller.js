const Fueling = require('../models/fueling.model');
const PowerPlant = require('../models/powerPlants.model');
const User = require('../models/users.model');

exports.fuelPowerPlant = async (req, res, next) => {
  try {
    const { userId, powerPlantId, fuelType, fuelAmount } = req.body;

    // Check if user and power plant exist
    const user = await User.findById(userId);
    const powerPlant = await PowerPlant.findById(powerPlantId);

    if (!user || !powerPlant) {
      return res.status(404).json({ error: 'User or power plant not found' });
    }

    // Check if fuel type is valid for power plant
    if (!powerPlant.fuelType.includes(fuelType)) {
      return res
        .status(400)
        .json({ error: 'Invalid fuel type for power plant' });
    }

    // Check if user has enough fuel
    const powerPlantCount = user.powerPlants.find(
      (plant) => plant.powerPlant_id.toString() === powerPlant._id.toString()
    ).count;
    const totalFuelRequired = (fuelAmount * powerPlantCount)
    if (user.resources[fuelType] < totalFuelRequired) {
      return res.status(400).json({ error: 'User does not have enough fuel, you need ${totalFuelRequired}'});
    }

    // Deduct fuel from user's resources
    user.resources[fuelType] -= totalFuelRequired;
    await user.save();

    // Calculate energy and CO2 production from fuel
    const energyProduction = powerPlant.energyProduction * powerPlantCount
    const co2Production = powerPlant.co2Production * powerPlantCount

    // Create fueling instance and save to database
    const fueling = new Fueling({
      user: user._id,
      powerPlant: powerPlant._id,
      powerPlantCount: powerPlantCount,
      fuelAmount: totalFuelRequired,
    });
    await fueling.save();

    // Update user's energy and CO2 production
    user.energyProduction += energyProduction;
    user.co2Production += co2Production;
    await user.save();

    // Return success response
    return res.json({ message: 'Fuel added successfully' });
  } catch (err) {
    next(err);
  }
};
