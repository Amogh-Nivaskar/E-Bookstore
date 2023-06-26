const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    book: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().required(),
        
    }).required()
})
