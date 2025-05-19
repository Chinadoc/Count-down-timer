/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is needed to enable importing from outside the `apps/web` directory
  transpilePackages: ['@countdown-timer-app/ui', '@countdown-timer-app/core'],
  webpack: (config) => {
    // Aliasing react-native to react-native-web
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    // Necessary for some react-native libraries to work on the web
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

module.exports = nextConfig;
