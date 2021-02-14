var jwt = require('jsonwebtoken');
const common = require('./common');
const { Realm } = require('../../config/models');

let data = {
  unlock: (required_scope = null) => async (request, response, next) => {
    try {
      let realmConfig = await Realm.findOne().then((e) => e.toJSON());
      if (!realmConfig)
        throw {
          statusCode: 401,
          data: {
            message: `No realm exists`,
          },
        };
      let authHeader = request.headers['authorization'] || null;
      if (!authHeader && request.query['access_token']) {
        authHeader = 'Bearer ' + request.query['access_token'];
      }
      console.log('authHeader', authHeader);
      if (typeof authHeader !== 'undefined' && authHeader.includes('Bearer ')) {
        authHeader = authHeader.substring(7);
        jwt.verify(
          authHeader,
          realmConfig.public_key,
          { algorithm: realmConfig.algorithm },
          (err, decode) => {
            try {
              if (err) throw authHeader;
              let authZ = false;
              if (required_scope) {
                decode.scopes.map((e) => {
                  if (required_scope === e) {
                    authZ = true;
                    return false;
                  }
                });
              } else {
                authZ = true;
              }
              if (!authZ) {
                throw {
                  statusCode: 403,
                  data: {
                    message: `[SCOPE ERROR] - This route requires '${required_scope}' scope.`,
                  },
                };
              }
              request.user = decode;
              next();
            } catch (error) {
              response.reply({
                statusCode: error.statusCode || 401,
                data: error.data,
              });
            }
          }
        );
      } else {
        response.reply({ statusCode: 401 });
      }
    } catch (err) {
      response.reply({ statusCode: err.status || 401 });
    }
  },
  lock: async (obj, offline_flag = false) => {
    let realmConfig = await Realm.findOne().then((e) => e.toJSON());
    obj['iat'] = common.time();
    if (!offline_flag) obj['exp'] = common.time() + realmConfig.token_expiry;
    obj['access_token'] = jwt.sign(obj, realmConfig.private_key, {
      algorithm: realmConfig.algorithm,
    });
    return obj;
  },
};

module.exports = data;
