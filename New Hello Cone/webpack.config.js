const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/cone_colored.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "cone_colored_bundle.js",
  },
};
