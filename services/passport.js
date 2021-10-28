const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true
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
