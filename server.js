const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController')
const thoughtController = require('./controllers/thoughtController')

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/social_network_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userController);
app.use('/api/thoughts', thoughtController);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
