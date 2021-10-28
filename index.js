const express = require("express");
const mongoose = require('mongoose');
const cookieSession = require('cookie-session')
const passport = require("passport");

if (!process.env.NODE_ENV) require('dotenv').config()

const app = express();
const authRouter = require("./routes/auth");
require('./models/User')
require('./services/passport')

mongoose.connect(process.env.MONGO_CONNECTION_URI);

app.use(
  cookieSession({
    maxAge: 30 * 864e5,
    keys: [process.env.GOOGLE_COOKIE_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter)

app.get('/api/logout', ((req, res) => {
    req.logout() // passport added this method to request object!
    res.send(req.user) // It will be empty because passport has erased it in the last line!
  })
)

app.get('/api/current_user', ((req, res) => {
    res.send(req.user)
  })
)

const PORT = process.env.PORT || 5000;
app.listen(PORT);
