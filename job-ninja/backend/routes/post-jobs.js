const express = require('express');
const router = express.Router();
const Job = require('./models/jobModel'); // Import the Mongoose model


// Define a route to add a new job

router.post('/', async (req, res) => {
  try {
    //const userId = req.user._id
    //console.log('req user ', req.user)

    const newData = req.body;
    //newData.userId = userId
    console.log('req body ', req.body)

    const job = new Job(newData); // Create a new instance of the Job model
    const savedJob = await job.save(); // Save the job to the database
    res.status(201).json(savedJob); // Respond with the saved job data
    console.log('Job saved successfully ')
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
