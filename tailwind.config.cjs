module.exports = {
content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        'primary': '#82D844',
        'text-primary': 'hsl(0, 0%, 13%)',
        'text-secondary': 'hsl(0, 0%, 29%)',
        'text-muted': 'hsl(0, 0%, 60%)',
        'text-on-dark': 'hsl(0, 0%, 90%)',
      }
    },
  },
  plugins: [],
};
