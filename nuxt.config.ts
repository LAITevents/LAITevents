export default defineNuxtConfig({
    components: true,
    modules: [
        "@nuxtjs/supabase",
        "@nuxtjs/tailwindcss",
        "@nuxt/image-edge",
        "nuxt-icon",
    ],

    runtimeConfig: {
        public: {
            apiKey: process.env.MAPS_KEY,
            googleLink: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&libraries=places`,
        },
    },

    head: {
        htmlAttrs: {
            lang: "da_DK",
        },
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
        ],
        link: [
            {
                rel: "preload",
                href: "/fonts/gordita-bold.woff2",
                as: "font",
                type: "font/woff2",
                crossorigin: true,
            },
            {
                rel: "preload",
                href: "/fonts/gordita-medium.woff2",
                as: "font",
                type: "font/woff2",
                crossorigin: true,
            },
            {
                rel: "preload",
                href: "/fonts/gordita-regular.woff2",
                as: "font",
                type: "font/woff2",
                crossorigin: true,
            },
        ],
    },
});
