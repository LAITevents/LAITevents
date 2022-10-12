// tailwind.config.js
module.exports = {
	content: [
		`components/**/*.{vue,js}`,
		`layouts/**/*.vue`,
		`pages/**/*.vue`,
		`composables/**/*.{js,ts}`,
		`plugins/**/*.{js,ts}`,
		`App.{js,ts,vue}`,
		`app.{js,ts,vue}`
	],
	theme: {
		extend: {
			colors: {
				"lait-blue": "#376570",
				"lait-yellow": "#ffd264",
				"light-blue": "#4c757f",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
