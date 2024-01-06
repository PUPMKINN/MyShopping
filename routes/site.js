const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");
const User = require("../models/User");

router.get("/search", siteController.search);
router.get("/test", (req, res, next) => {
    res.render("index", { layout: 'admin' });
    //res.render();
})
router.get("/aboutUs", siteController.aboutUs);
router.get("/", siteController.getHomePage);

module.exports = router;
