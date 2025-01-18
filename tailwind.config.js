/** @type {import('tailwindcss').Config} */
const config = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'bg-left': 'var(--color-bg-left)',
  			'bg-right': 'var(--color-bg-right)',
  			'purple-btn-focus': 'var(--color-purple-btn-focus)',
  			'purple-btn-unfocus': 'var(--color-purple-btn-unfocus)',
  			'blue-btn-focus': 'var(--color-blue-btn-focus)',
  			'blue-btn-unfocus': 'var(--color-blue-btn-unfocus)',
  			'green-btn-focus': 'var(--color-green-btn-focus)',
  			'green-btn-unfocus': 'var(--color-green-btn-unfocus)',
  			'orange-btn-focus': 'var(--color-orange-btn-focus)',
  			'orange-btn-unfocus': 'var(--color-orange-btn-unfocus)',
  			'red-btn-focus': 'var(--color-red-btn-focus)',
  			'red-btn-unfocus': 'var(--color-red-btn-unfocus)',
  			'lime-btn-focus': 'var(--color-lime-btn-focus)',
  			'lime-btn-unfocus': 'var(--color-lime-btn-unfocus)',
  			'yellow-btn-focus': 'var(--color-yellow-btn-focus)',
  			'yellow-btn-unfocus': 'var(--color-yellow-btn-unfocus)',
  			'color-text': 'var(--color-text)',
  			'sidebar-focus': 'var(--color-sidebar-focus)',
  			'sidebar-unfocus': 'var(--color-sidebar-unfocus)',
  			ball: 'var(--color-ball)',
  			tooltip: 'var(--color-tooltip)',
  			'tooltip-border': 'var(--color-tooltip-border)',
  			'common-focus': 'var(--color-common-focus)',
  			'common-unfocus': 'var(--color-common-unfocus)',
  			'rare-focus': 'var(--color-rare-focus)',
  			'rare-unfocus': 'var(--color-rare-unfocus)',
  			'epic-focus': 'var(--color-epic-focus)',
  			'epic-unfocus': 'var(--color-epic-unfocus)',
  			'legendary-focus': 'var(--color-legendary-focus)',
  			'legendary-unfocus': 'var(--color-legendary-unfocus)',
  			'mega-focus': 'var(--color-mega-focus)',
  			'mega-unfocus': 'var(--color-mega-unfocus)',
  			'ub-focus': 'var(--color-ub-focus)',
  			'ub-unfocus': 'var(--color-ub-unfocus)',
  			'gmax-focus': 'var(--color-gmax-focus)',
  			'gmax-unfocus': 'var(--color-gmax-unfocus)',
  			normal: 'var(--color-normal)',
  			grass: 'var(--color-grass)',
  			bug: 'var(--color-bug)',
  			fire: 'var(--color-fire)',
  			electric: 'var(--color-electric)',
  			ground: 'var(--color-ground)',
  			water: 'var(--color-water)',
  			fighting: 'var(--color-fighting)',
  			poison: 'var(--color-poison)',
  			rock: 'var(--color-rock)',
  			ice: 'var(--color-ice)',
  			ghost: 'var(--color-ghost)',
  			psychic: 'var(--color-psychic)',
  			fairy: 'var(--color-fairy)',
  			dark: 'var(--color-dark)',
  			dragon: 'var(--color-dragon)',
  			steel: 'var(--color-steel)',
  			flying: 'var(--color-flying)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
