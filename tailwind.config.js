/** Tailwind config — rispecchia la config inline usata col CDN.
 *  Build: npm run build:css  (compila assets/styles.css minificato). */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#04150E',
          900: '#06241A',
          800: '#0A3D2A',
          700: '#0F5236',
          600: '#15694A',
        },
        gold: {
          light: '#F0D78A',
          DEFAULT: '#C9A24B',
          mid: '#B8893A',
          deep: '#8A6420',
        },
        ivory: '#F6F1E4',
        mute: '#C9C3B2',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        script: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
    },
  },
};
