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
        teal: {
          DEFAULT: "#59c3c3",
          light: "#ACE0E0",
          dark: "#42849A",
        },
        navy: {
          DEFAULT: "#17255A",
          light: "#2F3B6B",
          dark: "#0D193F",
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
