// Declare all routes in rote config file

const indexRouter = require("../routes/index");
const usersRouter = require("../routes/users");
const path = require("path");

module.exports = app => {
  app.use("/api/users", usersRouter);
  app.use("/api/*", (req, res, next) => {
    res.reply({ statusCode: 404 });
  });
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });
};
