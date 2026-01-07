const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ======================
   ✅ CORS (FINAL + CORRECT)
   ====================== */

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl, health checks
      if (!origin) return callback(null, true);

      // Allow localhost dev
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* ======================
   ✅ BODY PARSER
   ====================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

console.log("Backend is running");

module.exports = app;
