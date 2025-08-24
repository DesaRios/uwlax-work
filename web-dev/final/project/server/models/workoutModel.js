// Import mongoose
var mongoose = require('mongoose');

// Workout schema
var workoutSchema = new mongoose.Schema({
    name: String,
    sets: {order: Number, reps: Number, weight: Number},
});

var Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;