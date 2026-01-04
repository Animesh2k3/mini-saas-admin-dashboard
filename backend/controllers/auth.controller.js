const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const roleRes = await pool.query(
    "SELECT id FROM roles WHERE name='user'"
  );

  await pool.query(
    "INSERT INTO users (name, email, password, role_id) VALUES ($1,$2,$3,$4)",
    [name, email, hashed, roleRes.rows[0].id]
  );

  res.json({ message: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT u.*, r.name as role 
     FROM users u 
     JOIN roles r ON r.id = u.role_id 
     WHERE email=$1`,
    [email]
  );

  if (!result.rows.length) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};