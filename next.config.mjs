/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Verhindert, dass Server-Bibliotheken im Browser landen oder Vercel crashen
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
      'canvas': 'commonjs canvas',
    });
    return config;
  },
};

export default nextConfig;
