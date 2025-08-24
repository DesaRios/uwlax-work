var express = require('express');
var router = express.Router();
var workoutService = require('../services/workoutService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET workouts */
router.get('/workouts', function(req, res, next) {
  workoutService.getWorkouts(req.query._id)
    .then(function(workouts) {
      res.send(workouts);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* GET workout */
router.get('/workouts/workout', function(req, res, next) {
  workoutService.getWorkout(req.query.index)
  .then(function(workout) {
    res.send(workout);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send({message: err.message});
  });
});

/* Add workout */
router.post('/workouts', function(req, res) {
  workoutService.addWorkout(req.body)
    .then(function(workout) {
      res.send(workout);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Delete workout */
router.delete('/workouts', function(req, res) {
  if(req.session.user.admin === false) {
    res.status(401).send('You do not have permission to delete a workout');
    return;
  }
  workoutService.deleteWorkout(req.query._id, req.query.workoutId)
    .then(function(workout) {
      res.send(workout);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Get workout videos */
router.get('/videos', function(req, res) {
  console.log('workoutName:', req.query.workoutName);
  workoutService.getWorkoutVideos(req.query.workoutName)
    .then(function(videos) {
      res.send(videos);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* filter workouts */
router.get('/workouts/filtered', function(req, res) {
  workoutService.filterWorkouts(req.query._id, req.query.query)
    .then(function(workouts) {
      res.send(workouts);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

module.exports = router;
