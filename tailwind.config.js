/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "bg-left": "var(--color-bg-left)",
        "bg-right": "var(--color-bg-right)",
        "purple-btn-focus": "var(--color-purple-btn-focus)",
        "purple-btn-unfocus": "var(--color-purple-btn-unfocus)",
        "blue-btn-focus": "var(--color-blue-btn-focus)",
        "blue-btn-unfocus": "var(--color-blue-btn-unfocus)",
        "green-btn-focus": "var(--color-green-btn-focus)",
        "green-btn-unfocus": "var(--color-green-btn-unfocus)",
        "red-btn-focus": "var(--color-red-btn-focus)",
        "red-btn-unfocus": "var(--color-red-btn-unfocus)",
        "color-text": "var(--color-text)",
        "sidebar-focus": "var(--color-sidebar-focus)",
        "sidebar-unfocus": "var(--color-sidebar-unfocus)",
        "ball": "var(--color-ball)",
        "tooltip": "var(--color-tooltip)",
        "tooltip-border": "var(--color-tooltip-border)",

        // Pokemon Rarity Colours
        "common-focus": "var(--color-common-focus)",
        "common-unfocus": "var(--color-common-unfocus)",
        "rare-focus": "var(--color-rare-focus)",
        "rare-unfocus": "var(--color-rare-unfocus)",
        "epic-focus": "var(--color-epic-focus)",
        "epic-unfocus": "var(--color-epic-unfocus)",
        "legendary-focus": "var(--color-legendary-focus)",
        "legendary-unfocus": "var(--color-legendary-unfocus)",

        // Pokemon Type Colours
        "normal": "var(--color-normal)",
        "grass": "var(--color-grass)",
        "bug": "var(--color-bug)",
        "fire": "var(--color-fire)",
        "electric": "var(--color-electric)",
        "ground": "var(--color-ground)",
        "water": "var(--color-water)",
        "fighting": "var(--color-fighting)",
        "poison": "var(--color-poison)",
        "rock": "var(--color-rock)",
        "ice": "var(--color-ice)",
        "ghost": "var(--color-ghost)",
        "psychic": "var(--color-psychic)",
        "fairy": "var(--color-fairy)",
        "dark": "var(--color-dark)",
        "dragon": "var(--color-dragon)",
        "steel": "var(--color-steel)",
        "flying": "var(--color-flying)"
      }
    }
  },
  plugins: []
};
