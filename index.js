const express = require("express");
const authRouter = require("./routes/auth");
const app = express();
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const passport = require("passport");
const keys = require("./config/keys");

require('./models/User')
require('./services/passport')
mongoose.connect(`mongodb://localhost:27017/emaily`);

app.use(
  cookieSession({
    maxAge: 30 * 864e5,
    keys: [keys.cookieKey]
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
