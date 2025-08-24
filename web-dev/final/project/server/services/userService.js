var user = require('../models/userModel');
var bcrypt = require('bcrypt');
var Routine = require('../models/routineModel');
const { findById } = require('../models/workoutModel');
var Session = require('../models/sessionModel');

async function createUsers() {
  for (let i = 0; i < 5000; i++) {
    const password = `password${i}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: `User${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      // add more fields as needed
    };

    const existingUser = await user.findOne({ email: userData.email });

    if (!existingUser) {
      await createUser(userData);
    }
  }
}

async function createUser(data) {
    const existingUser = await user.findOne({ email: data.email });
    data.password = await bcrypt.hash(data.password, 10);
    if (existingUser) {
        // If a user with the same email exists, throw an error or return a message
        throw new Error('A user with this email already exists');
    } else {
        // If no user with the same email exists, create the new user
        data.admin = false;
        return await user.create(data);
    }
}

async function validateUser(email, password) {
    // Fetch the user from the database
  const foundUser = await user.findOne({ email });

  if (foundUser === null) {
    throw new Error('User not found');
  }

  // Check the password
  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    throw new Error('Invalid password');
  }

  return foundUser;
}

async function updateUserInfo(data) {
  foundUser = await user.findById(data._id);
  foundUser.username = data.username;
  foundUser.height = data.height;
  foundUser.weight = data.weight;
  foundUser.age = data.age;

  return await foundUser.save();
}

async function updateUserGoals(data) {
  foundUser = await user.findById(data._id);
  goal = {workoutName: data.workoutName, reps: data.reps, weight: data.weight};
  foundUser.goals.push(goal);

  return await foundUser.save();
}

async function deleteUserGoal(data) {
  foundUser = await user.findById(data._id);
  foundUser.goals.splice(data.index, 1);

  return await foundUser.save();
}

async function addUserRoutine(data) {
  foundUser = await user.findById(data._id);
  const routine = new Routine({
    name: data.routine.name,
    workouts: data.routine.workouts,
    numWorkouts: data.routine.numWorkouts
  });

  // Save the routine to the routines collection
  await routine.save();

  foundUser.routines.push(routine._id);

  return await foundUser.save();
}

async function getUserRoutines(_id) {
  const foundUser = await user.findById(_id).populate({
    path: 'routines',
    populate: {
      path: 'workouts'
    }
  });
  console.log("foundUser routines:", foundUser.routines)
  return foundUser.routines;
}


async function getUserCurrentSession(_id) {
  const foundUser = await user.findById(_id).populate({
    path: 'currentSession',
    populate: {
      path: 'workouts'
    }
  });

  if (!foundUser) {
    throw new Error('User not found');
  }

  return foundUser.currentSession;
}

async function startUserSession(data) {
  foundUser = await user.findById(data._id);
  console.log("numWorkouts:", data.routine.numWorkouts);
  const workoutDetailsArray = Array(data.routine.numWorkouts).fill(null).map(() => 
    Array(3).fill(null).map((_, index) => ({
      set: index + 1,
      reps: 0,
      weight: 0
    }))
  );
  console.log("workoutDetailsArray:", workoutDetailsArray);

  const session = new Session({
    name: data.routine.name,
    workouts: data.routine.workouts,
    workoutArray: workoutDetailsArray,
    status: 'In Progress',
    date: new Date(),
    duration: 0
  });

   // Save the routine to the routines collection
   await session.save();

  foundUser.currentSession = session._id;
  return await foundUser.save();
}

async function updateUserSession(data) {
  foundUser = await user.findById(data._id);
  session = await Session.findByIdAndUpdate(data.session._id, data.session, {new: true});

  if (!session) {
    throw new Error('Session not found');
  }

  foundUser.currentSession = session._id;
  return await foundUser.save();
}

async function endUserSession(data) {
  foundUser = await user.findById(data._id);
  session = await Session.findByIdAndUpdate(data.session._id, {status: 'Completed'}, {new: true});
  
  if (!session) {
    throw new Error('Session not found');
  }

  // add to user's session history
  foundUser.pastSessions.push(session._id);
  
  foundUser.currentSession = null;
  return await foundUser.save();
}

async function getUserWorkoutHistory(_id) {
  const foundUser = await user.findById(_id).populate({
    path: 'pastSessions',
    populate: {
      path: 'workouts'
    }
  });

  if (!foundUser) {
    throw new Error('User not found');
  }

  return foundUser.pastSessions;
}

async function searchUserHistory(_id, search) {
  const foundUser = await user.findById(_id).populate({
    path: 'pastSessions',
    populate: {
      path: 'workouts'
    }
  });

  if (!foundUser) {
    throw new Error('User not found');
  }

  console.log("search:", search);
  

  const filteredSessions = foundUser.pastSessions.filter(session => typeof session.name === 'string' && typeof search === 'string' && session.name.toLowerCase().includes(search.toLowerCase()));
  return filteredSessions;
}

async function getAllUsers(_id) {
  foundUser = await user.findById(_id);
  if(foundUser.admin === false) {
    throw new Error('You do not have permission to view all users');
  }

  return await user.find();
}

async function changePassword(data) {
  foundUser = await user.findById(data._id);
  // Check the current password
  const match = await bcrypt.compare(data.currentPassword, foundUser.password);
  if (!match) {
    throw new Error('Invalid current password');
  }
  console.log("passwords match");
  // Change the password
  foundUser.password = await bcrypt.hash(data.newPassword, 10);
  return await foundUser.save();
}

async function deleteUserRoutine(_id, routine) {
  foundUser = await user.findById(_id);
  foundUser.routines.splice(routine, 1);
  deletedRoutine = await Routine.findByIdAndDelete(routine._id);

  return await foundUser.save();
}


module.exports = {
    createUser,
    validateUser,
    updateUserInfo,
    updateUserGoals,
    deleteUserGoal,
    addUserRoutine,
    getUserRoutines,
    startUserSession,
    getUserCurrentSession,
    updateUserSession,
    endUserSession,
    getUserWorkoutHistory,
    searchUserHistory,
    getAllUsers,
    createUsers,
    changePassword,
    deleteUserRoutine
};