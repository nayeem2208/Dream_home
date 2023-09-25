/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{html,jsx,}"],
  theme: {
    extend: {
      colors:{
        mainColor:'#259c99 ',
        footerColor:'#186e6b',
        mainColorDark:'#1b4544'
      },
      height:{
        '128':'40rem'
      }
    },
  },
  plugins: [
    
  ],
}

