var express = require("express");
var router = express.Router();
const { Realm } = require("../config/models");

/* GET home page. */
router.get("/.well-known/jwks.json", async function(req, res, next) {
  try {
    let realmConfig = await Realm.findOne();
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

module.exports = router;
