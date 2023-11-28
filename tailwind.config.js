/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3490dc",

        secondary: "#6574cd",
        gray: "#f8fafc",
        "dark-gray": "#2d3748",
        "dark-gray-2": "#4a5568",
        amarillo:"#fbd38d",
       
        "sky-blue":"#87ceeb",
      
        cyan:  "#00bcd4",
       
        red:  "#ff5f5f",
        
        pink: "#ff69b4",
        
        purple: "#8a2be2",
        
        green: "#2e8b57",
        
        orange:  "#ff8c00",
        
        yellow: "#ffd700",
        
      },
    },
  },
  plugins: [],
};
