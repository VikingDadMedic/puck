const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@puckeditor/core"],
  turbopack: {
    root: path.join(__dirname, "../../"),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://serpapi.com https://api.pexels.com https://api.unsplash.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
