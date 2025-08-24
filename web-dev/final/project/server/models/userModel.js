// Import mongoose
var mongoose = require('mongoose');
var Routine = require('./routineModel');

// User schema
var userSchema = new mongoose.Schema({
    admin: Boolean,
    email: String,
    password: String,
    username: String,
    height: Number,
    weight: Number,
    age: Number,
    goals: [{workoutName: String, reps: Number, weight: Number}],
    routines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Routine' }],
    pastSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    currentSession: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }
});

var User = mongoose.model('User', userSchema);
module.exports = User;