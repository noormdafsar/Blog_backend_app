const express = require('express');
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const errorMiddleware = require('./middlewares/errorMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://blog-frontend-app.onrender.com' // Deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Import Routes
const user = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

//use routes
app.use('/api/users', user);
app.use('/api/posts', postRoute);

// Error Middleware
app.use(errorMiddleware);



// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Connect to database
database.connect();

// listining to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

