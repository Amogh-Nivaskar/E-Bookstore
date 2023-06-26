const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const {userSchema} = require('../schemas');
const passport = require('passport');
const {storeReturnTo} = require('../middleware')



router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email})
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err)

            req.flash('success', 'Welcome to E-bookstore')
            res.redirect('/books');
        })
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login',storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  async(req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect(res.locals.returnTo || '/books');
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)

        req.flash('success', 'Goodbye!')
        res.redirect('/books')
    });  
})

module.exports = router