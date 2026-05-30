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
          surface: "var(--color-surface)",
          surfaceText: "var(--color-surface-text)",
          brown: "#412D15",
          cream: "#E1DCC9",
          background: "var(--color-background)",
          card: "var(--color-card)",
          border: "var(--color-border)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          primary: "var(--color-primary)",
          primaryHover: "var(--color-primaryHover)",
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
