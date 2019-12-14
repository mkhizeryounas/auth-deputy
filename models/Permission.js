const mongoose = require("mongoose");
const { slug } = require("../src/modules/common");
var permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: { unique: true },
      lowercase: true,
      set: slug
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
