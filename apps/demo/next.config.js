const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@puckeditor/core", "lucide-react"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
};
