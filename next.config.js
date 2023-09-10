const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })

    return config
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['utfs.io'],
  },
}

module.exports = process.env.DEV ? nextConfig : withPWA(nextConfig)
