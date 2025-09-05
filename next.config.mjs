/** @type {import('next').NextConfig} */
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
            destination: 'http://188.157.195.126:8000/api/:path*',
          },
          {
            source: '/auth/:path*',
            destination: 'http://188.157.195.126:8000/auth/:path*',
          },
        ];
      },
};

export default nextConfig;
