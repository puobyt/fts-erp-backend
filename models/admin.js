const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "User name is required"], // Add this line
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"], // Add this line
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Add this line
    },
    role: String

  },
  { timestamps: true }
);

const pendingAdminSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: String,
  role: String
});
const PendingAdmin = mongoose.model("PendingAdmin", pendingAdminSchema);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin, PendingAdmin };
