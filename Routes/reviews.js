const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Book = require('../models/book');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const {id} = req.params
    const book = await Book.findById(id);
    const {rating, body} = req.body.review
    const review = new Review({rating, body});
    review.author = req.user._id;
    book.reviews.push(review);
    await review.save();
    await book.save();
    req.flash('success', 'Successfully created new review!!')
    res.redirect(`/books/${id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params
    await Book.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/books/${id}`);
    // res.send("Deleted")
}))

module.exports = router