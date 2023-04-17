const ResourceToken = require('../models/resourceToken.model');

exports.createResourceToken = async (req, res) => {
  const { type, amount, ownerId } = req.body;
  try {
    const resourceToken = new ResourceToken({ type, amount, ownerId });
    await resourceToken.save();
    res.status(201).json(resourceToken);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getAllResourceTokens = async (req, res) => {
  try {
    const resourceTokens = await ResourceToken.find();
    res.json(resourceTokens);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.getResourceTokenById = async (req, res) => {
  const { id } = req.params;
  try {
    const resourceToken = await ResourceToken.findById(id);
    res.json(resourceToken);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.updateResourceToken = async (req, res) => {
  const { id } = req.params;
  const { type, amount, ownerId } = req.body;
  try {
    let resourceToken = await ResourceToken.findById(id);
    if (!resourceToken) {
      return res.status(404).json({ msg: 'Resource token not found' });
    }
    resourceToken.type = type;
    resourceToken.amount = amount;
    resourceToken.ownerId = ownerId;
    await resourceToken.save();
    res.json(resourceToken);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

exports.deleteResourceToken = async (req, res) => {
  const { id } = req.params;
  try {
    let resourceToken = await ResourceToken.findById(id);
    if (!resourceToken) {
      return res.status(404).json({ msg: 'Resource token not found' });
    }
    await resourceToken.remove();
    res.json({ msg: 'Resource token removed' });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
