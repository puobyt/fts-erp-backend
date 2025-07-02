var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
var adminRouter = require("./routes/admin");

const dbConnect = require("./configs/database");
const { default: rateLimit } = require("express-rate-limit");

var app = express();
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
}));
app.use(
  cors({
    origin: "*", 
    methods: "GET,POST,PUT,DELETE", 
    allowedHeaders: "Content-Type,Authorization", 
  })
);
app.use(express.static(path.join(__dirname, "public")));
dbConnect();
app.use("/", adminRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.get("/api", (req, res) => {
  res.send("FTS API Home Page");
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

module.exports = app;
