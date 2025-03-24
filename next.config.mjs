/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // API_URL: "http://localhost:8000",
    // API_URL: "https://finance-api.codesharer.xyz",
    API_URL: "https://arrax.mainulhasan99.xyz",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
