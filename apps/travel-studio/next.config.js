const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@puckeditor/core"],
  turbopack: {
    root: path.join(__dirname, "../../"),
  },
};
