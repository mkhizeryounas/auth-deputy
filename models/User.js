const mongoose = require("mongoose");
const { isEmail } = require("validator");
const common = require("../src/modules/common");

const sources = {
  EMAIL: "email",
  GITHUB: "github"
};

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      validate: [isEmail],
      required: true,
      index: { unique: true },
      lowercase: true
    },
    password: { type: String, required: true, set: common.hash },
    permission_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission"
    },
    source: {
      type: String,
      required: true,
      enum: Object.entries(sources).map(([key, value]) => value),
      default: sources.EMAIL
    },
    is_superuser: {
      type: Boolean,
      default: false
    },
    external_reference: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    strict: true
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
