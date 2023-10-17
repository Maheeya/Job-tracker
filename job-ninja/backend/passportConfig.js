const User = require('./routes/models/userModel')
bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy

module.exports = function (passport) {
    passport.use(
      new localStrategy(async (username, password, done) => {
        try {
          const user = await User.findOne({ username: username });
  
          if (!user) {
            return done(null, false);
          }
  
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (passwordMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err);
        }
      })
    );
  
    passport.serializeUser((user, cb) => {
      cb(null, user.id);
    });
  
    passport.deserializeUser(async (id, cb) => {
      try {
        const user = await User.findOne({ _id: id });
  
        if (!user) {
          return cb(null, false);
        }
  
        const userInformation = {
          username: user.username,
          _id: user.id
          // Add other properties if needed
        };
  
        cb(null, userInformation);
      } catch (err) {
        return cb(err);
      }
    });
  };

