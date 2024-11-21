/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  
  },

};

export default nextConfig;
