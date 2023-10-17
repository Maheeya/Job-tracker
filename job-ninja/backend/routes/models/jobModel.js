const mongoose = require('mongoose')

const jobSchema = {
    title: String,
    company: String,
    salary: String,
    requirements: String,
    status: String,
    link: String,
    location: String,
    docs: String,
    docsComplete: String,
    deadline: String,
    interviewDate: String,
    Notes: String,
    userId: {
        type: String,
        ref: 'User',
        required: true, // This ensures that a user ID is required when creating a job
    },
}

const Job = mongoose.model("Jobs", jobSchema, 'job')
module.exports = Job