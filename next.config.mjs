/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: the same build deploys to Vercel or GitHub Pages unchanged.
  output: "export",
  images: { unoptimized: true },
  // Emit each route as a folder with index.html so plain static hosts resolve it.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
