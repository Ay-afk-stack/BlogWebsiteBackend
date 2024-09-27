const mongoose = require("mongoose");

//Creating a databaseConnection Function
const connectToDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database Connection Successful!");
};

module.exports = connectToDatabase;
