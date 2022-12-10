/** @type {import('next').NextConfig} */
const external_host = process.env.NEXT_PUBLIC_EXTERNAL_HOST;
const host = process.env.NEXT_PUBLIC_HOST;
const nextConfig = {
    reactStrictMode: true,
    // async redirects() {
    //     return [
    //         {
    //             source: `/api/:path*`,
    //             destination: `${external_host}/api/:path*`,
    //             permanent: false,
    //         },
    //     ];
    // },

    // async rewrites() {
    //     return [
    //         {
    //             source: `/api/:path*`,
    //             destination: `${external_host}/api/:path*`,
    //         },
    //     ];
    // },
};

module.exports = nextConfig;
