const mongoose = require("mongoose");

var realmSchema = new mongoose.Schema(
  {
    public_key: {
      type: String,
      required: true,
      index: { unique: true }
    },
    private_key: {
      type: String,
      required: true,
      index: { unique: true }
    },
    token_expiry: {
      type: Number,
      required: true,
      default: 60 * 60 * 1 // 1 Hour
    },
    algorithm: {
      type: String,
      required: true,
      default: "RS256"
    },
    default_permission_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission"
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

realmSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Realm", realmSchema);
