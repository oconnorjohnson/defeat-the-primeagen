/** @type {import('next').NextConfig} */
import { NextConfig } from "next";
import crypto from "crypto-browserify";

const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        crypto: crypto,
      },
    };
    return config;
  },
};

export default nextConfig;
