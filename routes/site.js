const express = require("express");
const router = express.Router();

const siteController = require("../controllers/SiteController");
const User = require("../models/User");

router.get("/search", siteController.search);
router.get("/test", (req, res, next) => {
    res.render("index", {layout: 'admin'});
    //res.render();
})
router.get("/aboutUs", (req, res, next) => {
    if(req.user == null){
        res.render("aboutUs", {layout: 'guest'});
        return;
    }
    const user = User.findById(req.user._id).lean();
    const role = req.user.role;
    res.render("aboutUs", {layout: role, user: user});
});
router.get("/", siteController.getHomePage);

module.exports = router;
