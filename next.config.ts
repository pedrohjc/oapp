import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotos oficiais dos deputados
      {
        protocol: "https",
        hostname: "www.camara.leg.br",
        pathname: "/**",
      },
      // Fotos dos senadores
      {
        protocol: "https",
        hostname: "www.senado.leg.br",
        pathname: "/**",
      },
      // CDN alternativo usado pela API da Câmara
      {
        protocol: "https",
        hostname: "*.camara.leg.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
