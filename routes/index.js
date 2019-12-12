var express = require("express");
var router = express.Router();
const { User } = require("../config/models");

/* GET home page. */
router.get("/", async function(req, res, next) {
  res.reply({ data: { title: "Express" } });
});

router.get("/create-user", async function(req, res, next) {
  try {
    let newUser = new User({
      name: "Khizer Younas",
      email: `m.khizeryounas${Math.random()}@gmail.com`,
      password: "123",
      address: {
        address_1: "H No. 13-B, Samsani Road, Multan Road",
        city: "Lahore",
        country: "Pakistan",
        zip: "5400"
      }
    });
    let r = await newUser.save();
    console.log(r);
    res.reply({ data: r });
  } catch (err) {
    next(err);
  }
});

router.get("/update-user/", async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: "m.khizeryounas@gmail.com" });
    _user.name = "mkhizeryounas";
    _user.password = "abc123";
    let r = await _user.save();
    res.reply({ data: r });
  } catch (err) {
    next(err);
  }
});

router.get("/check-user/:pwd", async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: "m.khizeryounas@gmail.com" });
    let r = await _user.checkPassword(req.params.pwd);
    res.reply({ data: r });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
