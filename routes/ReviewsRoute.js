const express = require('express');
const router= express.Router();
const {createReviews}= require("../controller/ReviewsController")

router.post("/", createReviews)



module.exports= router