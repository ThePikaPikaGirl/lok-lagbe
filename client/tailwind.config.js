module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "bkash-pattern":
          "url(https://cdn.readme.io/hub/web/8828f629f8dcb849d77ad09b5a3ab84e.png), linear-gradient(to right, #d62267, #d62267)",
      },
      colors: {
        bkash: "#d62267",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
