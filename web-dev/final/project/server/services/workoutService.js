var workout = require('../models/workoutModel');
var user = require('../models/userModel');

async function getWorkouts(_id) {
    return await workout.find();
}

async function getWorkout(index) {
    return await workout.findOne({order: index});
}

async function addWorkout(data) {
    console.log('id:', data._id);
    foundUser = await user.findById(data._id);
    console.log('Found user:', foundUser);
    if(foundUser.admin === false) {
        throw new Error('You do not have permission to add a workout');
    }
    return await workout.create(data.workout);
}

async function deleteWorkout(_id, workoutId) {
    foundUser = await user.findById(_id);
    if(foundUser.admin === false) {
        throw new Error('You do not have permission to delete a workout');
    }
    console.log('Deleting workout:', workoutId);
    return await workout.findByIdAndDelete(workoutId);
}

async function getWorkoutVideos(workoutName) {
    const apiKey = 'AIzaSyAQQFghfVwvQ6jyVbFpxOwwggWaMbcu8qU'; // Replace with your YouTube Data API key
    let videos = [];
    await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${workoutName + ' workout tutorial'}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            videos = data.items.map(video => ({
                videoId: video.id.videoId,
                videoTitle: video.snippet.title
            }));
        })
        .catch(error => console.error('Error:', error));
    console.log('Videos:', videos);
    return videos;
}

async function filterWorkouts(_id, search) {
    const workouts = await workout.find();
    const filteredWorkouts = workouts.filter(workout => typeof workout.name === 'string' && typeof search === 'string' && workout.name.toLowerCase().includes(search.toLowerCase()));
    return filteredWorkouts;
}

module.exports = {
    getWorkouts,
    getWorkout,
    addWorkout,
    deleteWorkout,
    getWorkoutVideos,
    filterWorkouts
};