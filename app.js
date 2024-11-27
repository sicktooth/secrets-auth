require('dotenv').config();
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/routes');
const { connectDB, User } = require('./config/database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
    secret: "ourLittleSecret",
    resave: false,
    saveUninitialized: false,
    cookie: { // this was required compared to the course
        secure: false, // Use true with HTTPS
        httpOnly: true,
        expires: undefined, // Session expires when the browser is closed
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to database
connectDB().then(() => console.log("Connected to MongoDB")).catch(console.error);

// Passport Configuration
passport.use(User.createStrategy());

// the next two lines are for local storage alone.
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// the next are for mongodb storage and retrieval plus local storage

// Serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id); // Store only the user ID
  });
  
  // Deserialize user
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id); // Fetch user from DB
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user); // Attach full user object to req.user
    } catch (err) {
      done(err, null); // Handle errors gracefully
    }
  });
  

// Passport Google auth

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create a new user if one does not exist
        user = await User.create({
          googleId: profile.id,
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error); // Pass error to Passport
    }
  }
));


// routes

app.use('/', routes);


// Register user
app.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(400).render('register', { message: "Registration failed", error: err.message });
        }
        req.login(user, (err) => { // this is required to login the user after registration to the database compared to passport.authenticate in the course
            if (err) {
                console.error(err);
                return res.status(500).render('register', { message: "Login after registration failed", error: err.message });
            }
            res.redirect('/secrets');
        });
    });
});

// Login user
app.post('/login', passport.authenticate('local', { // this changed too and it became simpler as seen compared to the course that used passport.authenticate
    successRedirect: '/secrets',
    failureRedirect: '/login',
}));

// Start server
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
