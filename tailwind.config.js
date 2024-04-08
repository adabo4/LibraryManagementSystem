/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      textShadow: {
        headlineShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        custom: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        menuFont: ['Arial, Helvetica, sans-serif']
      },
      keyframes: {
        spinRed: {
          '0%': { transform: 'rotate(0)', backgroundColor: 'rgba(134, 16, 16, 0)' },
          '50%': { transform: 'rotate(180deg)', backgroundColor: 'rgba(134, 16, 16, 0.5)' },
          '100%': { transform: 'rotate(180deg)', backgroundColor: 'rgba(134, 16, 16, 0)' },
        },
        spinGreen: {
          '0%': { transform: 'rotate(0)', backgroundColor: 'rgba(0, 128, 0, 0)' },
          '50%': { transform: 'rotate(-180deg)', backgroundColor: 'rgba(0, 128, 0, 0.5)' },
          '100%': { transform: 'rotate(-180deg)', backgroundColor: 'rgba(0, 128, 0, 0)' },
        },
        spinBlue: {
          '0%': { transform: 'rotate(0)', backgroundColor: 'rgba(16, 16, 120, 0)' },
          '50%': { transform: 'rotate(180deg)', backgroundColor: 'rgba(16, 16, 120, 0.5)' },
          '100%': { transform: 'rotate(180deg)', backgroundColor: 'rgba(16, 16, 120, 0)' },
        },
        spinOrange: {
          '0%': { transform: 'rotate(0)', backgroundColor: 'rgba(255, 165, 0, 0)' },
          '50%': { transform: 'rotate(-180deg)', backgroundColor: 'rgba(255, 165, 0, 0.5)' },
          '100%': { transform: 'rotate(-180deg)', backgroundColor: 'rgba(255, 165, 0, 0)' },
        },
      
      
      },
      animation: {
        'spinRed': 'spinRed 4s',
        'spinGreen': 'spinGreen 4s',
        'spinBlue': 'spinBlue 4s',
        'spinOrange': 'spinOrange 4s'
  
      },
      backgroundImage: {
        backgroundImage: 'url("../img/libraryBackground.jpg")',
      },
      boxShadow: {
        dropdown: '0px 8px 20px 0px rgba(0, 0, 0, 1)'
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}



