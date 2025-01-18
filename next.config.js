/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Add API proxy rules here to avoid CORS issues
      {
        source: '/api/bitcoin',
        destination: 'https://api.blockchain.info/stats'
      },
      // Add more API proxies as needed
    ]
  }
}

module.exports = nextConfig
