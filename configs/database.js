const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect('mongodb://localhost:27017/EnterpriseApplication')
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => console.log(err.message));
};

module.exports = dbConnect;
