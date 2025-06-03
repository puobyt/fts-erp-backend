const mongoose = require("mongoose");
require("dotenv").config();

// const dbConnect = () => {
//   mongoose
//     .connect(process.env.MONGO_LOCAL_URL)
//     .then(() => {
//       console.log("Mongodb connected successfully");
//     })
//     .catch((err) => console.log(err.message));
// };


const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => console.log(err.message));
};

// const dbConnect = () => {
//   mongoose
//     .connect(process.env.MONGO_ATLAS_URL_OFFICIAL)
//     .then(() => {
//       console.log("Mongodb connected successfully");
//     })
//     .catch((err) => console.log(err.message));
// };


// databaseConfig
module.exports = dbConnect;
