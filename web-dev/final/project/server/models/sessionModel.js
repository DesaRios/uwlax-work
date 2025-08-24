var mongoose = require('mongoose');

// Session schema
var sessionSchema = new mongoose.Schema({
    name: String,
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
    workoutArray: Array,
    status: String,
    date: Date,
    duration: Number
});

var Session = mongoose.model('Session', sessionSchema);
module.exports = Session;