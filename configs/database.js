const mongoose = require("mongoose");
require("dotenv").config();

// const dbConnect = () => {
//   mongoose
//     .connect(process.env.MONGO_URL)
//     .then(() => {
//       console.log("Mongodb connected successfully");
//     })
//     .catch((err) => console.log(err.message));
// };


const dbConnect = () => {
  mongoose
    .connect('mongodb+srv://yanuhiwii:7pS6GIuIuy40NyLu@clusterfts.wqv73.mongodb.net/FtsCrm?retryWrites=true&w=majority&appName=ClusterFTS')
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => console.log(err.message));
};

module.exports = dbConnect;
