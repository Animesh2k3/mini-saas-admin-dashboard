const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   ✅ CORS (SINGLE SOURCE)
   ====================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mini-saas-admin-dashboard.onrender.com/"
];

console.log("backend is running");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://mini-saas-admin-dashboard.vercel.app", // production frontend
    ],
    credentials: true,
  })
);

/* ======================
   ✅ BODY PARSER
   ====================== */
app.use(express.json());

/* ======================
   ✅ ROUTES
   ====================== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/configs", require("./routes/config.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/avatar", require("./routes/avatar.routes"));
app.use("/api/audit-logs", require("./routes/auditLogs.routes"));

/* ======================
   ✅ HEALTH CHECK
   ====================== */
app.get("/", (req, res) => {
  res.send("Mini SaaS API is running");
});

module.exports = app;
