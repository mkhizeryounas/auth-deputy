if (process.env.NODE_ENV === "production") require("dotenv").config();
module.exports = {
  mongodb:
    process.env.mongodb ||
    "mongodb://mkhizeryounas:Mkhizer_321@ds255728.mlab.com:55728/authdeputy",
  secret: process.env.secret || "c6aSsUzQBACrdWoWy6g7BkuxwKfkPbmB"
};
