var jwt = require("jsonwebtoken");
const common = require("./common");
const cert = require("../../config/keys").secret;
const { User } = require("../../config/models");

let data = {
  unlock: required_scope => async (request, response, next) => {
    let authHeader = request.headers["authorization"] || "";

    if (typeof authHeader !== "undefined" && authHeader.includes("Bearer ")) {
      authHeader = authHeader.substring(7);
      jwt.verify(authHeader, cert, (err, decode) => {
        try {
          if (err) throw authHeader;
          // Here is authentication check from db & then...
          let authZ = false;
          decode.permission_group.scopes.map(e => {
            if (required_scope === e.name) {
              authZ = true;
              return false;
            }
          });
          if (!authZ && !decode.is_superuser)
            throw {
              statusCode: 403,
              data: {
                message: `[SCOPE ERROR] - This route requires '${required_scope}' scope.`
              }
            };
          request.user = decode;
          next();
        } catch (error) {
          response.reply({
            statusCode: error.statusCode || 401,
            data: error.data
          });
        }
      });
    } else {
      response.reply({ statusCode: 401 });
    }
  },
  lock: obj => {
    obj["iat"] = common.time();
    obj["exp"] = common.time() + 60 * 60 * 24;
    obj["access_token"] = jwt.sign(obj, cert);
    return obj;
  }
};

module.exports = data;
