const express = require('express');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors')

// Load env files
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Body Parser
app.use(express.json())

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
    res.send('Root path')
});

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`server running on ${PORT}`));

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // close server and exit
    server.close(() => process.exit(1));
})