const mongoose = require('mongoose');

const Trade = require('../models/trades.model');
const User = require('../models/users.model');

// Create the Trade
const createTrade = async (req) => {
  const {
    senderId,
    recipientId,
    senderResources,
    recipientResources,
    senderMoney,
    recipientMoney,
  } = req.data;
  try {
    // Validate sender and recipient exist and are different users
    const [sender, recipient] = await Promise.all([
      User.findById(new mongoose.Types.ObjectId(senderId)),
      User.findById(new mongoose.Types.ObjectId(recipientId)),
    ]);
    if (!sender || !recipient) {
      return { code: 404, message: 'Sender and recipient must be valid users' };
    }
    if (sender.equals(recipient)) {
      return {
        code: 400,
        message: 'Sender and recipient cannot be the same user',
      };
    }

    let result = await Trade.findOne({
      $and: [
        { $or: [{ senderId: recipientId }, { recipientId: recipientId }] },
        { status: 'pending' },
      ],
    });
    if (result != null) {
      return {
        code: 405,
        message: 'Current User is Pending!',
      };
    }

    const senderResourcesName = Object.keys(senderResources);
    const senderResourcesValue = Object.values(senderResources);

    const recipientResourcesName = Object.keys(recipientResources);
    const recipientResourcesValue = Object.values(recipientResources);

    const senderInfo = senderResourcesName.map((item, index) => {
      return {
        resource: item,
        amount: senderResourcesValue[index],
      };
    });

    const recipientInfo = recipientResourcesName.map((item, index) => {
      return {
        resource: item,
        amount: recipientResourcesValue[index],
      };
    });

    const trade = await Trade.create({
      senderId,
      recipientId,
      senderResources: senderInfo,
      recipientResources: recipientInfo,
      senderMoney,
      recipientMoney,
      status: 'pending',
    });

    // Save the model
    await trade.save();

    return { code: 200, data: trade };
  } catch (error) {
    return { code: 500, message: 'CreateTrade went wrong' };
  }
};

// Accept the Trade
const acceptTrade = async (req) => {
  try {
    const trade = await Trade.findById(req.data);
    if (!trade) {
      return { code: 404, message: 'Trade not found' };
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

    // recipientUser
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

    return { code: 200, data: trade };
  } catch (error) {
    return { code: 500, message: 'AcceptTrade went wrong' };
  }
};

// Reject the Trade
const rejectTrade = async (req) => {
  try {
    const trade = await Trade.findById(req.data);
    if (!trade) {
      return { code: 404, message: 'Trade not found' };
    }

    // Update trade status
    trade.status = 'rejected';
    await trade.save();

    return { code: 200, trade };
  } catch (error) {
    return { code: 500, message: 'RejectTrade went wrong' };
  }
};

module.exports = {
  createTrade,
  acceptTrade,
  rejectTrade,
};
