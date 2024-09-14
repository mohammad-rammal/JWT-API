const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    return console.log("Successfully connected to DB. 👍");
  } catch (err) {
    return console.log(err);
  }
};

module.exports = connectDB;
