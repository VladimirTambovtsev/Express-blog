const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
	res.send('1');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});