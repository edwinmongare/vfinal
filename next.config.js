/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "stateoforigin.oyostate.gov.ng",
      },
    ],
  },
  pageExtensions: ["ts", "tsx"],
};

module.exports = nextConfig;
