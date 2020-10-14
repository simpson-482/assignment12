var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

console.log("at the very top of passprot.js...");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    console.log("at the top of passprot.js, inside new LocalStrategy...");
    // When a user tries to sign in this code runs
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function(dbUser) {
      // If there's no user with the given email
      if (!dbUser) {
        console.log("inside passport.js 111...");
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (!dbUser.validPassword(password)) {
        console.log("inside passport.js 222...");
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above, return the user
      console.log("inside passport.js 333...");
      return done(null, dbUser);
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  console.log("inside serializeUser...");
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  console.log("inside deserializeUser...");
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
