import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // "prompt": o app nunca troca de versão sozinho por baixo dos panos.
      // Mostramos um aviso ("Nova versão disponível") e só atualiza quando
      // o cliente confirma — importante para não interromper um pedido em
      // andamento nem deixar ninguém preso numa versão antiga sem saber.
      registerType: "prompt",

      // Ícones e manifest ficam em public/, não precisam ser precacheados
      // duas vezes.
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],

      manifest: {
        name: "Dupla Do Açaí",
        short_name: "Dupla Do Açaí",
        description: "Açaí artesanal na garrafa em Redenção e Acarape - CE.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#3A0F52",
        background_color: "#2B0A3D",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        // Em modo standalone (app instalado) não existe barra de endereço
        // para digitar "/admin" manualmente. Este atalho aparece ao
        // pressionar e segurar o ícone do app (Android/desktop).
        shortcuts: [
          {
            name: "Painel administrativo",
            short_name: "Admin",
            description: "Acessar o painel administrativo da Dupla Do Açaí",
            url: "/admin",
            icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
          },
        ],
      },

      workbox: {
        // Só pré-armazena o "app shell" estático (HTML/JS/CSS/ícones/fontes
        // do build). Nada dinâmico entra aqui.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],

        // Nunca deixa o app preso numa versão antiga do app shell.
        cleanupOutdatedCaches: true,

        // Não criar um "catch-all" de navegação que sirva index.html para
        // rotas de admin ainda não visitadas enquanto offline — cada rota
        // só funciona offline depois de já ter sido carregada uma vez.
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/admin/],

        // Cache apenas de recursos estáticos e realmente seguros de reusar.
        // Firebase (Firestore/Auth), WhatsApp e Nominatim NUNCA são
        // interceptados aqui — continuam indo direto pra rede, sempre.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      devOptions: {
        // Facilita testar o PWA em `npm run dev` sem precisar de build.
        enabled: false,
      },
    }),
  ],
});
