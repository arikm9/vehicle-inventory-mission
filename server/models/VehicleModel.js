const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

// set the DB schema structure
const vehicleModel = new Schema({
	name: { type: String },
	type: { type: String },
	creationDate: { type: Date, default: Date.now },
	lastConnetionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('vehicles', vehicleModel)