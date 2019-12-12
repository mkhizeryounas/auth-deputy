/**
 * Declare all models in model config file
 * Auto import all models from models folder
 *
 * NOTE:
 *  - Do not make any folder in models folder
 *  - Keep pascal naming conventions
 * */

const fs = require("fs");
const base_path = `${process.cwd()}/models`;
const toExport = {};

fs.readdirSync(base_path).map(e => {
  if (!e.includes(".js")) return;
  const tmp = require(`${base_path}/${e}`);
  if (tmp.hasOwnProperty("model")) toExport[e.replace(".js", "")] = tmp;
});

module.exports = toExport;
