const esbuild = require("rollup-plugin-esbuild").default;
const replace = require("@rollup/plugin-replace");

const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

module.exports = [
  bundle({
    output: {
      dir: "dist",
      format: "cjs",
    },
    plugins: [
      esbuild({ minify: true }),
      replace({
        preventAssignment: true,
        values: {
          __EXPERIMENTAL__: false,
        },
      }),
    ],
  }),
];
