const Review = require("../models/Review");
const { mongooseToObject } = require("../util/mongoose");
const mongoose = require("mongoose");

// [POST] /review/store
const store = async (req, res, next) => {
    try {
        //res.json(req.body);
        //res.json(req.params.id);
        const formData = req.body;
        formData.productId = req.params.id;
        const review = new Review(formData);
        review.save().then;
        res.redirect("/");
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    store, 
};