const express = require("express");
const session = require('express-session');
const passport = require('passport');
const { connectDB, User } = require('./config/database');

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
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/logout', (req, res)=>
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      })) // this required a callback function compared to the course

// Protected route
app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) { //isAunthenticated is a function compared to the course
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

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
