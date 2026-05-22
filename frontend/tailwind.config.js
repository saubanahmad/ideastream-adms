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
      // Based on the original brown/cream brand identity
      colors: {
        brand: {
          dark:    '#3B1F0E',   // Darkest brown — sidebar bg
          primary: '#603F26',   // Medium brown — primary actions
          accent:  '#914F1E',   // Warm brown — buttons, active states
          light:   '#C97B3A',   // Light brown — hover states
          cream:   '#FFEAC5',   // Cream — backgrounds, text on dark
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
