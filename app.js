const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const PORT = config.get("PORT");
const errorMiddleWare = require("./middleware/error_handling_middleware");
const mainRouter = require("./routes/index.routes");
const cookieParser = require('cookie-parser');
const app = express();

// Use cors middleware to allow cross-origin requests
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true,  // Enable cookies or authentication headers
}));

// Parse cookies
app.use(cookieParser())

// Parse JSON requests
app.use(express.json())

// Define routes
app.use("/api", mainRouter)

// Handle errors
app.use(errorMiddleWare)

async function start() {
    try {
        await mongoose.connect(config.get("dbUri"));

        app.listen(PORT, () => {
            console.log("Server is running:", PORT);
        });
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
}

start();
