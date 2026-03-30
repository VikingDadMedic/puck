const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@puckeditor/core", "mapbox-gl"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
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
              "style-src 'self' 'unsafe-inline' https://rsms.me",
              "img-src 'self' data: https:",
              "font-src 'self' data: https://rsms.me",
              "connect-src 'self' https://serpapi.com https://api.pexels.com https://api.unsplash.com https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
