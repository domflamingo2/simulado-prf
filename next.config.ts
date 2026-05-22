// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Configurações específicas para desenvolvimento
  ...(isDev && {
    compiler: {
      removeConsole: false, // Mantém console.log em desenvolvimento
    },

    // Configuração para evitar cache em desenvolvimento
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-cache, no-store, must-revalidate",
            },
          ],
        },
      ];
    },
  }),

  // Configuração para Turbopack (substitui webpackDevMiddleware)
  turbopack: {
    // Configurações para Hot Reload mais rápido
    resolveAlias: {
      // Se precisar de aliases
    },
    // Desabilitar cache em desenvolvimento (opcional)
    // Dev options
  },

  // Mantém páginas em memória por mais tempo
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
