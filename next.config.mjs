/** @type {import('next').NextConfig} */
const { NextConfig } = require("next");
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
      },
    };
    return config;
  },
};

module.exports = nextConfig;

export default nextConfig;
