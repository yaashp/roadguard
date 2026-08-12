const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../data/store");

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

exports.register = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required." });
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    _id: `u_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || "",
    password: hashed,
    profileImage: "",
    role: "user",
    createdAt: new Date(),
  };
  users.push(newUser);

  const token = signToken(newUser);
  res.status(201).json({ success: true, token, user: sanitize(newUser) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const token = signToken(user);
  res.json({ success: true, token, user: sanitize(user) });
};

exports.me = async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
};
