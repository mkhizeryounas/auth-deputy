var express = require("express");
var router = express.Router();
const { User, Realm } = require("../config/models");
const locker = require("../src/modules/locker");
const common = require("../src/modules/common");

router.get(
  "/dashboard",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let users = await User.countDocuments({ is_superuser: false });
      let signups = await User.countDocuments({
        createdAt: {
          $gt: common.time() - 7 * 60 * 60 * 24
        },
        is_superuser: false
      });
      res.reply({ data: { users, signups } });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.put(
  "/settings",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let realm = await Realm.findOne();
      if (!realm) throw { status: 404 };
      realm.token_expiry = req.body.token_expiry;
      realm = await realm.save();
      realm = await realm.toJSON();
      res.reply({ data: realm });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.get(
  "/settings",
  locker.unlock("authdeputy:admin"),
  async (req, res, next) => {
    try {
      let realm = await Realm.findOne().then(e => e.toJSON());
      res.reply({ data: realm });
    } catch (err) {
      console.log("Err", err);
      next(err);
    }
  }
);

router.get("/.well-known/jwks.json", async function(req, res, next) {
  try {
    let realmConfig = await Realm.findOne().then(e => e.toJSON());
    if (!realmConfig) {
      throw {
        status: 400,
        data: { message: "Realm not yet setup" }
      };
    }
    res.reply({
      data: {
        public_key: realmConfig.public_key,
        algorithm: realmConfig.algorithm,
        token_expiry: realmConfig.token_expiry
      }
    });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

router.get("/authenticate", locker.unlock(), async (req, res, next) => {
  try {
    let accessFlag = true;
    let scopeAccessNeeded = "";
    if (req.query.scopes) {
      let avaialbe_scopes = req.user.scopes ? req.user.scopes.split(",") : [];
      req.query.scopes.split(",").map(async e => {
        if (!avaialbe_scopes.includes(e)) {
          accessFlag = false;
          scopeAccessNeeded = e;
          return false;
        }
      });
    }
    if (!accessFlag)
      throw {
        status: 403,
        message: `[SCOPE ERROR] - This route requires '${scopeAccessNeeded}' scope.`
      };
    res.reply({ data: req.user });
  } catch (err) {
    console.log("Err", err);
    next(err);
  }
});

module.exports = router;
