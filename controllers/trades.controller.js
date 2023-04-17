const Trade = require('../models/trades.model');
const User = require('../models/users.model');
const mongoose = require('mongoose');

exports.createTrade = async (req, res) => {
  try {
    const {
      senderId,
      recipientId,
      senderResources,
      recipientResources,
      senderMoney,
      recipientMoney,
    } = req.body;

    // Validate sender and recipient exist and are different users
    const [sender, recipient] = await Promise.all([
      User.findById(mongoose.Types.ObjectId(senderId)),
      User.findById(mongoose.Types.ObjectId(recipientId)),
    ]);
    if (!sender || !recipient) {
      return res
        .status(404)
        .json({ message: 'Sender and recipient must be valid users' });
    }
    if (sender.equals(recipient)) {
      return res
        .status(400)
        .json({ message: 'Sender and recipient cannot be the same user' });
    }

    // Validate sender has enough resources and money
    const senderNonRenewableResources = Object.keys(
      sender.resources.nonRenewable
    );
    const senderRenewableResources = Object.keys(sender.resources.renewable);
    const senderHasEnoughResources = senderResources.every((resource) => {
      if (senderNonRenewableResources.includes(resource.resource)) {
        return (
          sender.resources.nonRenewable[resource.resource] >= resource.amount
        );
      }
      if (senderRenewableResources.includes(resource.resource)) {
        return sender.resources.renewable[resource.resource] >= resource.amount;
      }
      return false;
    });
    if (!senderHasEnoughResources) {
      return res.status(400).json({
        message: 'Sender does not have enough resources to complete trade',
      });
    }
    if (sender.money < senderMoney) {
      return res.status(400).json({
        message: 'Sender does not have enough money to complete trade',
      });
    }

    // Create trade
    const trade = new Trade({
      senderId,
      recipientId,
      senderResources,
      recipientResources,
      senderMoney,
      recipientMoney,
      status: 'pending',
    });

    // Save trade
    await trade.save();

    return res.status(201).json(trade);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'An error occurred while creating trade' });
  }
};

// Retrieve all trades
exports.allGetTrades = async (req, res) => {
  try {
    const trades = await Trade.find();
    return res.status(200).json(trades);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Retrieve a single trade
exports.getTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(mongoose.Types.ObjectId(req.params.id));
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    return res.status(200).json(trade);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Accept a trade
exports.acceptTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // introduce users involved in the trade
    const senderUser = await User.findById(trade.senderId);
    trade.senderResources.forEach(async (senderResource) => {
      const userResource = Object.keys(senderUser.resources.nonRenewable).find(
        (resource) => resource.toString() == senderResource.resource.toString()
      );
      if (userResource) {
        senderUser.resources.nonRenewable[userResource] -=
          senderResource.amount;
      }
    });

    // add the recipients resources to sender
    trade.recipientResources.forEach(async (recipientResource) => {
      senderUser.resources.nonRenewable[recipientResource.resource] +=
        recipientResource.amount;
    });

    senderUser.money -= trade.senderMoney;
    senderUser.money += trade.recipientMoney;
    await senderUser.save();

    // Update recipient's resources
    const recipientUser = await User.findById(trade.recipientId);
    trade.recipientResources.forEach(async (recipientResource) => {
      const userResource = Object.keys(
        recipientUser.resources.nonRenewable
      ).find(
        (resource) =>
          resource.toString() == recipientResource.resource.toString()
      );
      if (userResource) {
        recipientUser.resources.nonRenewable[userResource] -=
          recipientResource.amount;
      }
    });

    // add the recipients resources to sender
    trade.senderResources.forEach(async (senderResource) => {
      recipientUser.resources.nonRenewable[senderResource.resource] +=
        senderResource.amount;
    });

    recipientUser.money -= trade.recipientMoney;
    recipientUser.money += trade.senderMoney;
    await recipientUser.save();

    // Update trade status
    trade.status = 'accepted';
    await trade.save();

    return res.status(200).json(trade);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Reject a trade
exports.rejectTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Update trade status
    trade.status = 'rejected';
    await trade.save();

    return res.status(200).json(trade);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Implement a locking system
const lockedTrades = {};

exports.lockTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (lockedTrades[trade._id]) {
      return res.status(403).json({ message: 'Trade is already locked' });
    }

    lockedTrades[trade._id] = true;
    req.trade = trade;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.unlockTrade = (req, res, next) => {
  const trade = req.trade;
  delete lockedTrades[trade._id];
  next();
};
