/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'southern': {
          cream: '#FDF8F5',
          beige: '#E8D8D0',
          brown: '#4A3D3D',
          green: '#8B9D83',
          accent: '#A87D7D',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-lora)', 'serif'],
      },
      borderRadius: {
        'southern': '0.5rem',
      },
      boxShadow: {
        'southern': '0 4px 12px rgba(168, 125, 125, 0.1)',
      },
    },
  },
  plugins: [],
}; 