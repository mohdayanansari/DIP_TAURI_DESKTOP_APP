/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				dark: {
					600: '#38393E',
					700: '#363537',
					800: '#242529',
				},
				light: {
					300: '#FDEADD',
					400: '#FDEADD',
				},
				app: {
					1: '#FFF27A',
					2: '#4d69ff',
					3: '#4d69ff',
				},
			},
		},
	},
	plugins: [],
};
