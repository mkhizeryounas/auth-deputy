const mongoose = require("mongoose");

var scopeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true
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
