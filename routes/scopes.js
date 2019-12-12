const express = require("express");
const router = express.Router();
const locker = require("../src/modules/locker");
const { Scope } = require("../config/models");

router.get("/", locker.unlock("scopes_read"), async (req, res, next) => {
  try {
    let _scopes = await Scope.find();
    res.reply({ data: _scopes });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.get("/:id", locker.unlock("scopes_read"), async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.post("/", locker.unlock("scopes_write"), async (req, res, next) => {
  try {
    let _scope = new Scope(req.body);
    _scope = await _scope.save();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.put("/:id", locker.unlock("scopes_write"), async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    _scope.name = req.body.name;
    _scope = await _scope.save();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.delete("/:id", locker.unlock("scopes_write"), async (req, res, next) => {
  try {
    let _scope = await Scope.findOne({ _id: req.params.id });
    if (!_scope) throw { status: 404 };
    _scope = await _scope.remove();
    res.reply({ data: _scope });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

module.exports = router;
