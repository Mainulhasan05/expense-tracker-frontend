/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    //API_URL: "http://localhost:8000",
    // API_URL: "https://finance-api.codesharer.xyz",
    API_URL: "https://expense-api.chapai.info",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: "600625956491-fr06e8jgoe2u9ce1v2e664p3oj62dgsr.apps.googleusercontent.com",
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
