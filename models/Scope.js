const mongoose = require("mongoose");
const { slug } = require("../src/modules/common");

var scopeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      set: slug
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

scopeSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Scope", scopeSchema);
