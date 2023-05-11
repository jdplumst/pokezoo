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
        "color-text": "var(--color-text)",
        "sidebar-focus": "var(--color-sidebar-focus)",
        "sidebar-unfocus": "var(--color-sidebar-unfocus)",
        "common-focus": "var(--color-common-focus)",
        "common-unfocus": "var(--color-common-unfocus)",
        "ball": "var(--color-ball)",
        "tooltip": "var(--color-tooltip)",
        "tooltip-border": "var(--color-tooltip-border)"
      }
    }
  },
  plugins: []
};
