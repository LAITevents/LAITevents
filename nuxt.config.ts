export default defineNuxtConfig({
    components: true,
    modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],

    runtimeConfig: {
        public: {
            apiKey: process.env.MAPS_KEY,
            googleLink: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_KEY}&libraries=places`,
        },
    },
});
