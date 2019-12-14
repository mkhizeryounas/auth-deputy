var express = require("express");
var router = express.Router();
const { Realm } = require("../config/models");
const locker = require("../src/modules/locker");
/* GET home page. */
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
