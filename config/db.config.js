const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongourl');
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        'mongodb+srv://superadmin:asdqwe123@carbonquestcluster.ls0sq.mongodb.net/?ssl=true&authSource=admin',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'CarbonQuestCluster',
      }
    );
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('mongon = ', err);
    // Exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
