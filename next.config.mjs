/** @type {import('next').NextConfig} */
const isGHPages = process.env.GITHUB_PAGES === 'true';
const nextConfig = {
  ...(isGHPages ? {
    output: 'export',
    basePath: '/MRK-Demo',
    images: { unoptimized: true },
  } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGHPages ? '/MRK-Demo' : '',
  },
};

export default nextConfig;
