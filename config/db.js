var mongoose = require("mongoose");
var keys = require("./keys");

mongoose.connect(keys.mongodb, { useNewUrlParser: true });

module.exports = mongoose.connection;
