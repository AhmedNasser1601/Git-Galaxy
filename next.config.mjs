/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dangerously allow production builds to successfully complete even if your project has ESLint errors or type errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
