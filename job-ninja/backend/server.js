const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const bodyParser = require('body-parser')
const User = require('./routes/models/userModel')
const Job = require('./routes/models/jobModel'); // Import the Mongoose model


// Require the jobs route file
const jobsRouter = require('./routes/fetch-jobs');
const addJobsRouter = require('./routes/post-jobs')

//---------------------------------------------END OF IMPORTS---------------------------------------------

require('dotenv').config();


const PORT = process.env.PORT || 3001;

const dbURI = process.env.DATABASE; // MongoDB connection URI 

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

/*
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
*/

// Middleware
app.use(express.json());
app.use(bodyParser. json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true,
}))

app.use(cookieParser('secretcode'))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)

//---------------------------------------------END OF MIDDLEWARE---------------------------------------------

// Routes

// Use the jobs route with a specific URL prefix
app.use('/api/jobs', async (req, res) => {
  try {
    console.log('req user ',req.user,'   ', req.user._id)
    const jobs = await Job.find({userId: req.user._id});
    res.json(jobs);
    console.log('Fetching jobs');
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/add', addJobsRouter);

// Handle pre-flight (OPTIONS) requests
app.options('/api/add', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your allowed origins
  res.header('Access-Control-Allow-Methods', 'POST'); // Allow POST requests
  res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
  res.status(200).send();
});

app.get('/', (req, res) => {
  res.send('Backend is running.');
});


app.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
      if (err) throw err
      if (!user) res.send("No user Exists");
      else{
          req.login(user, (err) => {
              if (err) throw err
              res.send('Successful Authenticated')

              console.log(req.user)
          })
      }
  })(req, res, next )
})

app.post('/register',  async (req, res) => {
  try {
      const data = await User.findOne({username: req.body.username})

      if (data) res.send("User already exists")
      if (!data) {

          const hashedPassword = await bcrypt.hash(req.body.password, 10) //needs to be await as it takes a couple seconds

          const newUser = new User({
              username:req.body.username,
              password: hashedPassword,
          })
          await newUser.save()
          res.send("User created")
      }
  } catch (error){
      console.error('Error findig user:', error);
  }
})



app.get('/user', (req, res) => {
  res.send(req.user);
})

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any errors that occur during logout
      console.error('Error during logout:', err);
      return res.status(500).send('Error during logout');
    }

    // Logout was successful, you can clear session data or perform other actions
    res.status(200).send('Logged out');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
