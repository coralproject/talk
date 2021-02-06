module.exports = {
  experimental: {
    applyComplexClasses: true,
  },
  purge: {
    content: [
      "./docs/pages/**/*.tsx",
      "./docs/components/**/*.tsx",
      "./docs/layouts/**/*.tsx",
    ],
  },
  theme: {
    extend: {
      colors: {
        coral: {
          light: "#fa9d87",
          DEFAULT: "#f77160",
          dark: "#d44a46",
        },
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ["first"],
    },
  },
  plugins: [],
};
