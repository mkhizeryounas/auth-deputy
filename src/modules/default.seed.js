const { Permission, Scope } = require("../../config/models");

const seedData = {
  permission: { admin: { name: "authdeputy_admin" }, basic: { name: "basic" } },
  scopes: [
    { name: "user_read" },
    { name: "user_write" },
    { name: "scope_read" },
    { name: "scope_write" },
    { name: "permission_read" },
    { name: "permission_write" }
  ]
};

module.exports = async () => {
  let entry;
  entry = await Permission.findOne(seedData.permission.admin);
  if (!entry) {
    await Scope.deleteMany({
      name: { $in: seedData.scopes.map(e => e.name) }
    });
    entry = await Scope.insertMany(seedData.scopes);
    seedData.permission.admin.scopes = entry.map(e => e._id);
    entry = await Permission.insertMany(
      Object.entries(seedData.permission).map(([key, value]) => value)
    );
  }
};
