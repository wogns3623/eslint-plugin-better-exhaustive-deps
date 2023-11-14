/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
  extends: ["eslint:recommended", "plugin:eslint-plugin/recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    requireConfigFile: false,
  },
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ["no-for-of-loops"],
  rules: {
    "no-unused-vars": "off",
    "no-case-declarations": "off",
    "eslint-plugin/no-deprecated-context-methods": "warn",
    "eslint-plugin/require-meta-has-suggestions": "off",
  },
};

module.exports = config;
