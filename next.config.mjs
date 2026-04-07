/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.GITHUB_PAGES === 'true' ? {
    output: 'export',
    basePath: '/MRK-Demo',
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
