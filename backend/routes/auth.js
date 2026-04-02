// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { generateToken } = require("../config/jwt");

const USERS = [
  {
    email: "user@test.com",
    password: "123456",
    role: "user",
  },
  {
    email: "user-2@test.com",
    password: "123456",
    role: "user",
  },
  {
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
];

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken({ email: user.email, role: user.role });
  res.status(200).json({
    token,
    user: { email: user.email, role: user.role },
  });
});

module.exports = router;