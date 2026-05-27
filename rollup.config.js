const esbuild = require("rollup-plugin-esbuild").default;
const replace = require("@rollup/plugin-replace");
const dts = require("rollup-plugin-dts").default;
const pkg = require("./package.json");

console.log(`Building ${pkg.name} v${pkg.version}...`);

module.exports = [
  {
    input: "src/index.ts",
    output: [{ file: pkg.main, format: "cjs" }],
    plugins: [
      esbuild({ minify: true }),
      replace({
        preventAssignment: true,
        values: { __EXPERIMENTAL__: false },
      }),
    ],
    external: (id) => !/^[./]/.test(id),
  },
  {
    input: "src/index.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
];
