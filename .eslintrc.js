/* eslint-env node */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "no-console": "warn",
    "newline-before-return": "error",
    "linebreak-style": "off",
    "arrow-body-style": "error",
    "import/first": "error",
    "import/newline-after-import": ["error", { count: 1 }],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@numaryhq/storybook",
            group: "sibling",
            position: "after",
          },
          {
            pattern: "../**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "^~/src/",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order:
            "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],

    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        singleQuote: true,
        arrowParens: "always",
        trailingComma: "es5",
        printWidth: 80,
      },
    ],
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-explicit-any": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
