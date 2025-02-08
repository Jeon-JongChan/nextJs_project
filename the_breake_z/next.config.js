/** @type {import('next').NextConfig} */
// const external_host = process.env.NEXT_PUBLIC_EXTERNAL_HOST;
// const host = process.env.NEXT_PUBLIC_HOST;
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [`${domain}`],
  },
};

module.exports = nextConfig;
