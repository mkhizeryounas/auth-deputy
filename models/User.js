const mongoose = require("mongoose");
const { isEmail } = require("validator");
const common = require("../src/modules/common");

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      validate: [isEmail],
      required: true,
      dropDups: true
    },
    password: { type: String, required: true, set: common.hash },
    address: {
      address_1: String,
      city: String,
      country: String,
      zip: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = async function(password) {
  if (common.hash(password) === this.password) {
    console.log(this);
    return this;
  }
  throw { status: 401 };
};

module.exports = mongoose.model("User", userSchema);
