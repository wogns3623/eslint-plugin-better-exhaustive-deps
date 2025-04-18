/**
 * This file is purely being used for local jest runs, and doesn't participate in the build process.
 */
"use strict";

module.exports = {
  plugins: [
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-transform-flow-strip-types",
  ],
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
