const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Book = require('../models/book');
const {isLoggedIn, validateBook, isAuthor} = require('../middleware')





router.get('/', catchAsync(async (req, res, next) => {
    const books = await Book.find({});
    res.render('books/index', {books})
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('books/new');
});

router.post('/', isLoggedIn, validateBook, catchAsync(async (req, res) => {
    const book = new Book(req.body.book);
    book.author = req.user._id;
    await book.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/books/${book._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!book) {
        req.flash('error', 'Book does not exist');
        return res.redirect('/books');
    }
    res.render('books/show', {book});
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id)
    if (!book) {
        req.flash('error', 'Book does not exist');
        return res.redirect('/books');
    }
    res.render('books/edit', {book});
}))

router.put('/:id', isLoggedIn, isAuthor, validateBook, catchAsync(async (req, res) => {
    const id = req.params.id
    const book = await Book.findByIdAndUpdate(id, {...req.body.book})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/books/${book._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id
    await Book.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted book')
    res.redirect('/books')
}))

module.exports = router;
