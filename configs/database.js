const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect('mongodb://localhost:27017/EnterpriseApplication')
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => console.log(err.message));
};
// const dbConnect = () => {
//   mongoose
//     .connect('mongodb+srv://yanuhiwii:7pS6GIuIuy40NyLu@clusterfts.wqv73.mongodb.net/FtsCrm?retryWrites=true&w=majority&appName=ClusterFTS')
//     .then(() => {
//       console.log("Mongodb connected successfully");
//     })
//     .catch((err) => console.log(err.message));
// };

module.exports = dbConnect;
