const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("../config/keys");
const mongoose = require("mongoose");

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id,(err, user) => done(err, user))
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    }, (at, rt, profile, done) => {
      User.findOne({googleID: profile.id}).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser)
        } else {
          new User({googleID: profile.id}).save().then((res) => {
            done(null, res)
          })
        }
      }).catch((err) => {
        console.log("Error getting user! ", err)
      })
    }
  )
);
