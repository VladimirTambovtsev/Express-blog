const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
	res.send('1');
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});