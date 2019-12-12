const mongoose = require("mongoose");

var permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true
    },
    scopes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scope" }]
  },
  {
    timestamps: true,
    strict: true
  }
);

permissionSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Permission", permissionSchema);
