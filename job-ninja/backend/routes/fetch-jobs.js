const express = require('express');
const router = express.Router();
const Job = require('./models/jobModel'); // Import the Mongoose model



// Define a route to get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({_id: req.user._id});
    res.json(jobs);
    console.log('Fetching jobs');
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
