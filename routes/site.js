const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");

router.get("/search", siteController.search);
router.get("/aboutus",siteController.AboutUs);
router.get("/", siteController.getHomePage);
///site/aboutus
module.exports = router;


