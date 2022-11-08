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
				"lait-grey": "#D9D9D9"
			},
			fontFamily: {
				regular: "'gordita-regular', sans-serif",
				bold: "'gordita-bold', sans-serif",
				medium: "'gordita-medium', sans-serif",

				sans: ['"gordita-regular"', 'sans-serif']
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
