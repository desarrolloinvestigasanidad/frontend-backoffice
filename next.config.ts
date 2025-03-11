import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora errores de ESLint durante el build de producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
