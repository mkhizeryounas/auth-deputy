const express = require("express");
const router = express.Router();
const { User, Permission } = require("../config/models");
const common = require("../src/modules/common");
const locker = require("../src/modules/locker");

router.post("/signin", async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: req.body.email }).populate({
      path: "permission_group",
      populate: {
        path: "scopes",
        model: "Scope"
      }
    });
    let authUser = await _user.checkPassword(req.body.password);
    let accessToken = locker.lock(common.parse(authUser));
    res.reply({ data: accessToken });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    let has_superuser = await User.findOne({ is_superuser: true });
    if (!has_superuser) {
      req.body.is_superuser = true;
      req.body.permission_group = await Permission.findOne({
        name: "authdeputy_admin"
      });
    } else {
      req.body.permission_group = await Permission.findOne({
        name: "basic"
      });
    }
    req.body.permission_group = req.body.permission_group._id;
    let entry = new User(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.get(
  "/authenticate",
  locker.unlock("user_read"),
  async (req, res, next) => {
    try {
      if (req.query.scopes) {
        console.log("CHECK SCOPES");
      }
      res.reply({ data: req.user });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.get("/", locker.unlock("user_read"), async (req, res, next) => {
  try {
    let entries = await User.find().populate("permission_group");
    res.reply({ data: entries });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.get("/:id", locker.unlock("user_read"), async (req, res, next) => {
  try {
    let entry = await User.findOne({ _id: req.params.id }).populate(
      "permission_group"
    );
    if (!entry) throw { status: 404 };
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.post("/", locker.unlock("user_write"), async (req, res, next) => {
  try {
    if (!req.user.is_superuser) req.body.is_superuser = false;
    let entry = new User(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.put("/:id", locker.unlock("user_write"), async (req, res, next) => {
  try {
    if (!req.user.is_superuser) req.body.is_superuser = false;
    let entry = await User.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry.name = req.body.name;
    entry.email = req.body.email;
    entry.password = req.body.password;
    entry.permission_group = req.body.permission_group;
    entry.is_superuser = req.body.is_superuser;
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.delete("/:id", locker.unlock("user_write"), async (req, res, next) => {
  try {
    if (!req.user.is_superuser) throw { statusCode: 403 };
    let entry = await User.findOne({ _id: req.params.id });
    if (!entry) throw { status: 404 };
    entry = await entry.remove();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

module.exports = router;
