/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        "node:crypto": "crypto",
      },
    };
    return config;
  },
};

export default nextConfig;
