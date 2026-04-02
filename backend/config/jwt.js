// backend/config/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "very-secret-jwt-key";

function generateToken(user) {
  const email = user?.email;
  const role = user?.role;
  return jwt.sign({ email, role }, JWT_SECRET, { expiresIn: "1d" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };