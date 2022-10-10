/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["tailwindui.com"],
  },
  experimental: {
    urlImports: ["https://www.gstatic.com/firebasejs/"],
  },
};

module.exports = nextConfig;
