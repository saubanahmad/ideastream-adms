/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  // This enables "purging" unused CSS in production builds
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom IdeaStream color palette
      // Updated to Option B: Dark Brown + Muted Teal
      colors: {
        brand: {
          black: "#000000",
          surface: "#1F150C",
          brown: "#412D15",
          cream: "#E1DCC9",
          background: "#000000",
          card: "#1F150C",
          border: "#412D15",
          text: "#E1DCC9",
          muted: "rgba(225, 220, 201, 0.65)",
          primary: "#412D15",
          primaryHover: "#563C1E",
        },
      },
      fontFamily: {
        // Modern sans-serif for body text
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Playful display font for headings (matching old project personality)
        display: ['Fredoka', 'cursive'],
      },
    },
  },
  plugins: [],
}
