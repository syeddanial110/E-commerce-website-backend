const express = require('express');
const router= express.Router();
const {createReviews, getReviews}= require("../controller/ReviewsController")

router.post("/", createReviews)
router.get("/", getReviews)
router.get("/search/:page", (req, res) => {
    const resultsPerPage = 5;
    let page = req.params.page >= 1 ? req.params.page : 1;
    const query = req.query.search;
    page = page - 1

    Product.find({ name: query })
        .select("name")
        .sort({ name: "asc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .then((results) => {
            return res.status(200).send(results);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});


module.exports= router