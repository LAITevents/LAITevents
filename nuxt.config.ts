import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
	components: true,

	css: ["~/assets/css/tailwind.css"],
	modules: ["@nuxtjs/supabase"],
	build: {
		postcss: {
			postcssOptions: {
				plugins: {
					tailwindcss: {},
					autoprefixer: {},
				},
			},
		},
	},
});
