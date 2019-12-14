// Declare all routes in rote config file

const indexRouter = require("../routes/index");
const permissionsRouter = require("../routes/permissions");
const usersRouter = require("../routes/users");
const scopesRouter = require("../routes/scopes");
const path = require("path");

module.exports = app => {
  app.use("/api/permissions", permissionsRouter);
  app.use("/api/scopes", scopesRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/", indexRouter);

  app.use("/api/*", (req, res, next) => {
    res.reply({ statusCode: 404 });
  });
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });
};
