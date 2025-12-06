const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


// Logger
app.use(morgan('dev'));

// Helmet (loosened only what's needed)
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.set('trust proxy', 1);


// Test route
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Event service active" });
});

// ✅ Keep your route as-is
const routes = require("./routes/v1/eventRoutes");
app.use("/", routes);


// Error middleware
const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);

module.exports = app;
