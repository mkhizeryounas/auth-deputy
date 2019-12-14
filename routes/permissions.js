const express = require("express");
const router = express.Router();
const locker = require("../src/modules/locker");
const { Permission } = require("../config/models");

router.get("/", locker.unlock("authdeputy:admin"), async (req, res, next) => {
  try {
    let entries = await Permission.find().populate("scopes");
    res.reply({ data: entries });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.get(
  "/:id",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let entry = await Permission.findOne({ _id: req.params.id }).populate(
        "scopes"
      );
      if (!entry) throw { status: 404 };
      res.reply({ data: entry });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.post("/", locker.unlock("authdeputy:admin"), async (req, res, next) => {
  try {
    let entry = new Permission(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.put(
  "/:id",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let entry = await Permission.findOne({ _id: req.params.id });
      if (!entry) throw { status: 404 };
      entry.name = req.body.name;
      entry = await entry.save();
      res.reply({ data: entry });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.delete(
  "/:id",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let entry = await Permission.findOne({ _id: req.params.id });
      if (!entry) throw { status: 404 };
      entry = await entry.remove();
      res.reply({ data: entry });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

module.exports = router;
