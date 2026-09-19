/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/admin/**': ['./StudentTools_1105_Blog_Topics_Database.xlsx', './data/**/*'],
      '/api/**': ['./StudentTools_1105_Blog_Topics_Database.xlsx', './data/**/*'],
      '/blog/**': ['./data/**/*'],
    },
  },
}

export default nextConfig
