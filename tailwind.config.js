/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",       // for Next.js app directory
    "./src/pages/**/*.{js,ts,jsx,tsx}",     // for Next.js pages directory
    "./src/components/**/*.{js,ts,jsx,tsx}",// your components
  ],
  theme: {
    extend: {
      fontFamily: {
        serifDisplay: ['DM Serif Display', 'serif'],
        gideon: ['Gideon Roman', 'serif'],
      },
    },
  },
  plugins: [],
};
