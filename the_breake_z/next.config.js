/** @type {import('next').NextConfig} */
let host = process.env.NEXT_PUBLIC_HOST;
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: host + `/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
