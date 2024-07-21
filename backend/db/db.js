const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://workvanshchopra:1B1Z3kjcN2tVry2J@user.2tymb3f.mongodb.net/?retryWrites=true&w=majority&appName=User";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};

module.exports = connectToMongo;