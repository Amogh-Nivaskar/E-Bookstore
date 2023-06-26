const express = require("express");
const app = express();
const cors = require("cors");
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
// const Joi = require('joi');
const User = require('./models/user');


const bookRoutes = require('./Routes/books');
const reviewRoutes = require('./Routes/reviews')
const userRoutes = require('./Routes/users')

mongoose.connect('mongodb://127.0.0.1:27017/ebookstoreDB')
.then(() => {
    console.log("connection successfull");
}).catch(err => {
    console.log(err)
})

const PORT = process.env.PORT || 5000;

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60  * 24 * 7, // expires in a week
        maxAge: 1000 * 60 * 60  * 24 * 7
    }
}
app.use(session(sessionConfig))



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// app.use(cors({
//     origin: process.env.SRC_URL,
// }))


app.use(flash())
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/books', bookRoutes)
app.use('/books/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users', catchAsync(async (req, res) => {
    const users = await User.find({})
    res.render('users/index', {users})
}));

app.get('/makeUser', catchAsync(async (req, res) => {
    const user = new User({email: 'faker@gmail.com', username: 'faker'});
    const newUser = await User.register(user, 'abcd')
    res.send(newUser);
}));





app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    
    err.message = err.message || 'Something Went Wrong !!!';
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).render('error', {err});
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}.`);
})

