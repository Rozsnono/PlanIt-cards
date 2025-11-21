/** @type {import('next').NextConfig} */

const IP_LOCALHOST = "http://localhost:8000";

const nextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['images.unsplash.com'],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `${IP_LOCALHOST}/api/:path*`,
          },
          {
            source: '/auth/:path*',
            destination: `${IP_LOCALHOST}/auth/:path*`,
          },
        ];
      },
};

export default nextConfig;
