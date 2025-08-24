// Import mongoose
var mongoose = require('mongoose');
var Workout = require('./workoutModel');

// Routine schema
var routineSchema = new mongoose.Schema({
    name: String,
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
    numWorkouts: Number
});

var Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;