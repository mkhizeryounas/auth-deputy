const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../src/modules/cypher");

var realmSchema = new mongoose.Schema(
  {
    public_key: {
      type: String,
      required: true,
      set: encrypt
    },
    private_key: {
      type: String,
      required: true,
      set: encrypt
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
  obj.private_key = decrypt(obj.private_key);
  obj.public_key = decrypt(obj.public_key);
  return obj;
};

module.exports = mongoose.model("Realm", realmSchema);
