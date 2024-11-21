var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
var adminRouter = require("./routes/admin");

const dbConnect = require("./configs/database");

var app = express();
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
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
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

module.exports = app;
