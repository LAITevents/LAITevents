// tailwind.config.js
module.exports = {
	content: [
		"./components/**/*.{vue,js}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
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
