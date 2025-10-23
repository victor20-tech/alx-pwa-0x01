import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true
});

const nextConfig = {
  reactStrictMode: true,
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "m.media-amazon.com",
          pathname: "/**",
          port: "",
        }
      ]
    }
};

// cast to any to satisfy NextConfig typing for remotePatterns
export default withPWA(nextConfig as any);