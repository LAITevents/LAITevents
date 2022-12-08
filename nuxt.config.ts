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
            slackUrl: process.env.SLACK_URL,
            apiKey: process.env.MAPS_KEY,
            googleLink: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&libraries=places`,
        },
    },

    app: {
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
        },
    },
});
