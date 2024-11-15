const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: String,
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
  OTP: String,
  otpExpiresAt: Date,
});
const PendingAdmin = mongoose.model("PendingAdmin", pendingAdminSchema);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin, PendingAdmin };
