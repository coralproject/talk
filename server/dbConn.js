const mongoose = require('mongoose');

try {
	mongoose.connect('mongodb://localhost/talk', (err, res) => {
		if (err) throw err;
		console.log('Connected to MongoDB!');
	})
} catch (err) {
	console.log('Cannot stablish a connection with MongoDB');
}
