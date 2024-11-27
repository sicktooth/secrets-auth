const express = require('express');
const passport = require('passport');

// Create a router
const router = express.Router();

// Define routes
router.get('/', (req, res) => res.render('home'));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.get('/logout', (req, res, next) =>
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
);

// After being authenticated by Google
router.get(
    '/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect to protected route.
        res.redirect('/secrets');
    }
);

// Protected route
router.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

// Export the router
module.exports = router;
