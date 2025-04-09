const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const errorMiddleWare = require("./middleware/error_handling_middleware");
const mainRouter = require("./routes/index.routes");
const app = express();

const PORT = config.get("PORT") || 3300;

// Define allowed origins
const allowedOrigins = [
  "http://10.10.3.250:5173",
  "http://localhost:5173",
  "https://mockapi.site",
  "https://admin.mockapi.site",
  "http://localhost:3000",
];

// CORS configuration

app.use(
   cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // If you want to allow all origins with credentials
      return callback(null, true);
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Handle preflight requests

// Parse cookies and JSON
app.use(cookieParser());
app.use(express.json());

// Set security headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization"
  );
  next();
});

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", mainRouter);
app.use(errorMiddleWare);

// Start server
app.listen(PORT, async () => {
  try {
    await mongoose.connect(config.get("dbUri"));
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
