/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, options) => {
    config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
    });
    
    return config;
  }
}

module.exports = nextConfig;