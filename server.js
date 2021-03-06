const express = require('express');
const mongoose = require('mongoose');
//const path = require("path");
const config = require('config');

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = config.get('MONGO_URI');

// CORS middleware
const cors = require('cors');
app.use(cors());

// Bodyparser middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Use routes
app.use('/users', require('./routes/users'));

// Listening to PORT
app.listen(port, () => console.log(`Server started on PORT ${port} ...`));
