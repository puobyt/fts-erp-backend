// ✅ MUST be first - before any other requires
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
var adminRouter = require("./routes/admin");

const dbConnect = require("./configs/database");
const { default: rateLimit } = require("express-rate-limit");

var app = express();

app.set("views", path.join(__dirname, "views"));
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(
  cors({
    origin: [
      "https://fts-erp-frontend.vercel.app",
      "http://localhost:3039"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
dbConnect();

// Routes
app.use("/", adminRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.get("/api", (req, res) => {
  res.send("FTS API Home Page");
});

// Error handlers
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

module.exports = app;
