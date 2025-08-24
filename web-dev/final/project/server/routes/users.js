var express = require('express');
var router = express.Router();
var User = require('../models/userModel');
var userService = require('../services/userService');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Use express-session middleware
router.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use secure cookies in production (HTTPS)
}));


/* User Login */
router.post('/login', function(req, res) {
  userService.validateUser(req.body.email, req.body.password)
  .then(function(user) {
    req.session.user = user;
    console.log('Session ID in login:', req.sessionID);
    res.send(req.session.user);
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send({message: err.message});
  });
});

/* User Logout */
router.post('/logout', function(req, res) {
  if(req.body._id !== req.session.user._id) {
    res.status(401).send('User is not authenticated');
    return;
  }
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send('Could not log out.');
    } else {
      res.send('Logged out');
    }
  });
});

/* Create User */
router.post('/', function(req, res) {
  console.log(req.body);
  userService.createUser(req.body)
    .then(function(user) {
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Authenticate User */
router.use(function(req, res, next) {
  if (req.session.user) {
    console.log('User is authenticated');
    next();
  } else {
    console.log('User is not authenticated');
    res.status(401).send('User is not authenticated');
  }
});

/* Get User */
router.get('/', function(req, res) {
  console.log('Session ID in get user:', req.sessionID);
  res.send(req.session.user);
});

/* Update User Info */
router.put('/info', function(req, res) {
  userService.updateUserInfo(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Update User Goals */
router.put('/goal', function(req, res) {
  userService.updateUserGoals(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Delete User Goal */
router.delete('/goal', function(req, res) {
  console.log('Query:', req.query);
  data = {_id: req.query._id, index: req.query.index};
  console.log('Data:', data)
  userService.deleteUserGoal(data)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Add User Routine */
router.post('/routine', function(req, res) {
  userService.addUserRoutine(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Delete User Routine */
router.delete('/routine', function(req, res) {
  userService.deleteUserRoutine(req.query._id, req.query.routine) 
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Get User Routines */
router.get('/routines', function(req, res) {
  userService.getUserRoutines(req.query._id)
    .then(function(routines) {
      console.log('Routines:', routines);
      res.send(routines);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Get User Current Session */
router.get('/session', function(req, res) {
  userService.getUserCurrentSession(req.query._id)
    .then(function(session) {
      console.log('Session:', session);
      res.send(session);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Start a user workout Session */
router.post('/session', function(req, res) {
  userService.startUserSession(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Update User Session */
router.put('/session', function(req, res) {
  userService.updateUserSession(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* End user session */
router.post('/sessions/session', function(req, res) {
  userService.endUserSession(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Get User Workout History */
router.get('/history', function(req, res) {
  userService.getUserWorkoutHistory(req.query._id)
    .then(function(history) {
      console.log('History:', history);
      res.send(history);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Search User History */
router.get('/history/search', function(req, res) {
  userService.searchUserHistory(req.query._id, req.query.query)
    .then(function(history) {
      console.log('History:', history);
      res.send(history);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Get all users */
router.get('/all', function(req, res) {
  if(req.session.user.admin === false) {
    res.status(401).send('You do not have permission to view all users');
    return;
  }
  userService.getAllUsers(req.query._id)
    .then(function(users) {
      res.send(users);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

/* Change password */
router.put('/password', function(req, res) {
  console.log('changing password:',  req.body.currentPassword, req.body.newPassword);
  userService.changePassword(req.body)
    .then(function(user) {
      console.log('Updated user:', user);
      req.session.user = user;
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send({message: err.message});
    });
});

module.exports = router;
