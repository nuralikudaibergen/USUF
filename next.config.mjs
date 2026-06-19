/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote optimization to kick in for /public assets.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
