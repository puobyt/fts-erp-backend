const JWT = require('jsonwebtoken');

const JWT_SECRET = "JISD3VAd";

const GenerateTokenAdmin = (adminEmail) => {
  return JWT.sign({ adminEmail }, JWT_SECRET, { expiresIn: "5d" });
};

const verifyTokenAdmin = (token) => {
  try {
    return JWT.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { GenerateTokenAdmin, verifyTokenAdmin };
