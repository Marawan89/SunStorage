const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const db = require("../../../db");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ msg: "Utente autenticato", user: req.user });
});

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password, role } = req.body;

    try {
      const [user] = await db.execute(
        "SELECT * FROM admin_users WHERE email = ?",
        [email]
      );
      if (user.length > 0) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await db.execute(
        "INSERT INTO admin_users (name, surname, email, password, role) VALUES (?, ?, ?, ?, ?)",
        [name, surname, email, hashedPassword, role]
      );

      const payload = { id: result.insertId };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const [user] = await db.execute(
        "SELECT * FROM admin_users WHERE email = ?",
        [email]
      );
      if (user.length === 0) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = { id: user[0].id };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.json({ msg: "Login successful" });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
