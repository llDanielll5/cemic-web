/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      }
      // Convert all other *.svg imports to React components
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  reactStrictMode: true,
  env: {
    REACT_APP_ACCESS_TOKEN_MAP_BOX:
      "pk.eyJ1IjoibGxkYW5pZWxsbDUiLCJhIjoiY2xpZzlwMTYxMGRsMDNocDdtdHU0OXE0NSJ9.waM5ZQDmzW-zkT0ho5xwWw",
    ADMIN_PASSWORD: "Cemic1243",
  },
};

module.exports = nextConfig;
