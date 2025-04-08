"use strict";

const ESLintTesterV7 = require("eslint-v7").RuleTester;
const ESLintTesterV9 = require("eslint-v9").RuleTester;
const ReactHooksESLintPlugin = require("../src");
const ReactHooksESLintRule = ReactHooksESLintPlugin.rules["exhaustive-deps"];

/**
 * A string template tag that removes padding from the left side of multi-line strings
 * @param {Array} strings array of code strings (only one expected)
 */
function normalizeIndent(strings) {
  const codeLines = strings[0].split("\n");
  const leftPadding = codeLines[1].match(/\s+/)[0];
  return codeLines.map((line) => line.substr(leftPadding.length)).join("\n");
}

/**
 * @typedef {string | import('eslint').RuleTester.ValidTestCase} RuleTesterValidTestCases
 */

/**
 * @typedef {import('eslint').RuleTester.InvalidTestCase} RuleTesterInvalidTestCases
 */

/**
 * @typedef {object} RuleTesterInput
 * @property {RuleTesterValidTestCases[] | undefined} valid
 * @property {RuleTesterInvalidTestCases[] | undefined} invalid
 */

/** @type {RuleTesterInput} */
const testCheckMemoizedVariableIsStatics = {
  valid: [
    {
      code: normalizeIndent`
        function MyComponent() {
          const memoized = useMemo(() => 'foo', []);
          useEffect(() => {
            console.log(memoized);
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const memoizedCallback = useCallback(() => {
            console.log('foo');
          }, []);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const local = 1;
          const memoizedCallback = useCallback(() => {
            console.log(local);
          }, [local]);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const local = 'a';
          const memoizedCallback = useCallback(() => {
            console.log(local);
          }, [local]);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
    },
  ],
  invalid: [
    {
      code: normalizeIndent`
        function MyComponent() {
          const memoized = useMemo(() => 'foo', []);
          useEffect(() => {
            console.log(memoized);
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: false }],
      errors: [
        {
          message:
            "React Hook useEffect has a missing dependency: 'memoized'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [memoized]",
              output: normalizeIndent`
                function MyComponent() {
                  const memoized = useMemo(() => 'foo', []);
                  useEffect(() => {
                    console.log(memoized);
                  }, [memoized]);
                }
            `,
            },
          ],
        },
      ],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const memoizedCallback = useCallback(() => {
            console.log('foo');
          }, []);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: false }],
      errors: [
        {
          message:
            "React Hook useEffect has a missing dependency: 'memoizedCallback'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [memoizedCallback]",
              output: normalizeIndent`
                function MyComponent() {
                  const memoizedCallback = useCallback(() => {
                    console.log('foo');
                  }, []);
                  useEffect(() => {
                    memoizedCallback();
                  }, [memoizedCallback]);
                }
            `,
            },
          ],
        },
      ],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const local = [];
          const memoizedCallback = useCallback(() => {
            console.log(local);
          }, [local]);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
      errors: [
        {
          message:
            "The 'local' array makes the dependencies of useCallback Hook (at line 6) change on every render. Move it inside the useCallback callback. Alternatively, wrap the initialization of 'local' in its own useMemo() Hook.",
        },
        {
          message:
            "React Hook useEffect has a missing dependency: 'memoizedCallback'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [memoizedCallback]",
              output: normalizeIndent`
                function MyComponent() {
                  const local = [];
                  const memoizedCallback = useCallback(() => {
                    console.log(local);
                  }, [local]);
                  useEffect(() => {
                    memoizedCallback();
                  }, [memoizedCallback]);
                }
            `,
            },
          ],
        },
      ],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const local = {};
          const memoizedCallback = useCallback(() => {
            console.log(local);
          }, [local]);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
      errors: [
        {
          message:
            "The 'local' object makes the dependencies of useCallback Hook (at line 6) change on every render. Move it inside the useCallback callback. Alternatively, wrap the initialization of 'local' in its own useMemo() Hook.",
        },
        {
          message:
            "React Hook useEffect has a missing dependency: 'memoizedCallback'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [memoizedCallback]",
              output: normalizeIndent`
                function MyComponent() {
                  const local = {};
                  const memoizedCallback = useCallback(() => {
                    console.log(local);
                  }, [local]);
                  useEffect(() => {
                    memoizedCallback();
                  }, [memoizedCallback]);
                }
            `,
            },
          ],
        },
      ],
    },
    {
      code: normalizeIndent`
        function MyComponent() {
          const local = someFunc();
          const memoizedCallback = useCallback(() => {
            console.log(local);
          }, [local]);
          useEffect(() => {
            memoizedCallback();
          }, []);
        }
    `,
      options: [{ checkMemoizedVariableIsStatic: true }],
      errors: [
        {
          message:
            "React Hook useEffect has a missing dependency: 'memoizedCallback'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [memoizedCallback]",
              output: normalizeIndent`
                function MyComponent() {
                  const local = someFunc();
                  const memoizedCallback = useCallback(() => {
                    console.log(local);
                  }, [local]);
                  useEffect(() => {
                    memoizedCallback();
                  }, [memoizedCallback]);
                }
            `,
            },
          ],
        },
      ],
    },
  ],
};

/** @type {RuleTesterInput} */
const testStaticHooks = {
  valid: [
    /** no matter what the staticValue is, it will be static if the staticHooks option is settled */
    {
      code: normalizeIndent`
        function useStaticHook() {
          const staticValue = { a:1 };
          return staticValue;
        }

        function MyComponent() {
          const staticValue = useStaticHook();
          useEffect(() => {
            console.log(staticValue);
          }, []);
        }
    `,
      options: [{ staticHooks: { useStaticHook: true } }],
    },
    /** can handle renamed return */
    {
      code: normalizeIndent`
        function useStaticHook() {
          const staticValue = { a:1 };
          return staticValue;
        }

        function MyComponent() {
          const sv = useStaticHook();
          useEffect(() => {
            console.log(sv);
          }, []);
        }
    `,
      options: [{ staticHooks: { useStaticHook: true } }],
    },
    /**
     * can handle renamed hook
     * @deprecated not supported yet
     */
    // {
    //   code: normalizeIndent`
    //     function useStaticHook() {
    //       const staticValue = { a:1 };
    //       return staticValue;
    //     }

    //     const useSh = useStaticHook;

    //     function MyComponent() {
    //       const sv = useSh();
    //       useEffect(() => {
    //         console.log(sv);
    //       }, []);
    //     }
    // `,
    //   options: [{ staticHooks: { useStaticHook: true } }],
    //   // skip: true, // not in eslint RuleTester, but in @typescript-eslint/rule-tester RuleTester
    // },
    /** can handle destructured array return */
    {
      code: normalizeIndent`
        function useHook() {
          const staticValue = { a:1 };
          const staticCallback = () => {};
          return [staticValue, staticCallback];
        }

        function MyComponent() {
          const [staticValue, staticCallback] = useHook();
          useEffect(() => {
            console.log(staticValue);
            staticCallback();
          }, []);
        }
    `,
      options: [{ staticHooks: { useHook: [true, true] } }],
    },
    /** can handle destructured array return with renamed variables */
    {
      code: normalizeIndent`
        function useHook() {
          const staticValue = { a:1 };
          const staticCallback = () => {};
          return [staticValue, staticCallback];
        }

        function MyComponent() {
          const [sv, sc] = useHook();
          useEffect(() => {
            console.log(sv);
            sc();
          }, []);
        }
    `,
      options: [{ staticHooks: { useHook: [true, true] } }],
    },
    /** can handle destructured object return */
    {
      code: normalizeIndent`
        function useHook() {
          const staticValue = { a:1 };
          const staticCallback = () => {};
          return { staticValue, staticCallback };
        }

        function MyComponent() {
          const { staticValue, staticCallback } = useHook();
          useEffect(() => {
            console.log(staticValue);
            staticCallback();
          }, []);
        }
    `,
      options: [
        {
          staticHooks: { useHook: { staticValue: true, staticCallback: true } },
        },
      ],
    },
    /** can handle destructured object return with renamed variables */
    {
      code: normalizeIndent`
        function useHook() {
          const staticValue = { a:1 };
          const staticCallback = () => {};
          return { staticValue, staticCallback };
        }

        function MyComponent() {
          const { staticValue: sv, staticCallback: sc } = useHook();
          useEffect(() => {
            console.log(sv);
            sc();
          }, []);
        }
    `,
      options: [
        {
          staticHooks: { useHook: { staticValue: true, staticCallback: true } },
        },
      ],
    },
    /**
     * can handle deep nested object return
     * @deprecated not supported yet
     */
    // {
    //   code: normalizeIndent`
    //     function useHook() {
    //       const value = { foo:{ staticProperty:1 } };
    //       const staticCallback = () => {};
    //       return { value, staticCallback };
    //     }

    //     function MyComponent() {
    //       const { value, staticCallback: sc } = useHook();
    //       useEffect(() => {
    //         console.log(value?.foo?.staticProperty);
    //         sc();
    //       }, []);
    //     }
    // `,
    //   options: [
    //     {
    //       staticHooks: {
    //         useHook: {
    //           value: { foo: { staticProperty: true } },
    //           staticCallback: true,
    //         },
    //       },
    //     },
    //   ],
    //   // skip: true,
    // },
  ],
  invalid: [
    // only works with staticHooks option
    {
      code: normalizeIndent`
        function useHook() {
          const value = { a:1 };
          return value;
        }
        function MyComponent() {
          const value = useHook();
          useEffect(() => {
            console.log(value);
          }, []);
        }
    `,
      errors: [
        {
          message:
            "React Hook useEffect has a missing dependency: 'value'. " +
            "Either include it or remove the dependency array.",
          suggestions: [
            {
              desc: "Update the dependencies array to be: [value]",
              output: normalizeIndent`
                function useHook() {
                  const value = { a:1 };
                  return value;
                }
                function MyComponent() {
                  const value = useHook();
                  useEffect(() => {
                    console.log(value);
                  }, [value]);
                }
              `,
            },
          ],
        },
      ],
    },
  ],
};

// For easier local testing
if (!process.env.CI) {
  let only = [];
  let skipped = [];
  [
    ...testCheckMemoizedVariableIsStatics.valid,
    ...testCheckMemoizedVariableIsStatics.invalid,
    // ...testsFlow.valid,
    // ...testsFlow.invalid,
    // ...testsTypescript.valid,
    // ...testsTypescript.invalid,
    // ...testsTypescriptEslintParserV4.valid,
    // ...testsTypescriptEslintParserV4.invalid,
  ].forEach((t) => {
    if (t.skip) {
      delete t.skip;
      skipped.push(t);
    }
    if (t.only) {
      delete t.only;
      only.push(t);
    }
  });
  const predicate = (t) => {
    if (only.length > 0) {
      return only.indexOf(t) !== -1;
    }
    if (skipped.length > 0) {
      return skipped.indexOf(t) === -1;
    }
    return true;
  };
  testCheckMemoizedVariableIsStatics.valid =
    testCheckMemoizedVariableIsStatics.valid.filter(predicate);
  testCheckMemoizedVariableIsStatics.invalid =
    testCheckMemoizedVariableIsStatics.invalid.filter(predicate);
  // testsFlow.valid = testsFlow.valid.filter(predicate);
  // testsFlow.invalid = testsFlow.invalid.filter(predicate);
  // testsTypescript.valid = testsTypescript.valid.filter(predicate);
  // testsTypescript.invalid = testsTypescript.invalid.filter(predicate);
  // testsTypescriptEslintParserV4.valid =
  //   testsTypescriptEslintParserV4.valid.filter(predicate);
  // testsTypescriptEslintParserV4.invalid =
  //   testsTypescriptEslintParserV4.invalid.filter(predicate);
}

const parserOptionsV7 = {
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion: 6,
  sourceType: "module",
};

const languageOptionsV9 = {
  ecmaVersion: 6,
  sourceType: "module",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

describe("better-exhaustive-deps/checkMemoizedVariableIsStatic", () => {
  // new ESLintTester({
  //   parser: require.resolve("@babel/eslint-parser"),
  //   parserOptions,
  // }).run("parser: @babel/eslint-parser static", ReactHooksESLintRule, tests);

  // new ESLintTester({
  //   parser: require.resolve("@typescript-eslint/parser-v5"),
  //   parserOptions,
  // }).run(
  //   "parser: @typescript-eslint/parser@^5.0.0-0 static",
  //   ReactHooksESLintRule,
  //   tests
  // );

  const testsBabelEslint = testCheckMemoizedVariableIsStatics;

  // new ESLintTesterV7({
  //   parser: require.resolve("babel-eslint"),
  //   parserOptions: parserOptionsV7,
  // }).run(
  //   "eslint: v7, parser: babel-eslint",
  //   ReactHooksESLintRule,
  //   testsBabelEslint
  // );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@babel/eslint-parser"),
    },
  }).run(
    "eslint: v9, parser: @babel/eslint-parser",
    ReactHooksESLintRule,
    testsBabelEslint
  );

  const testsTypescriptEslintParser = testCheckMemoizedVariableIsStatics;

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v2"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@2.x",
    ReactHooksESLintRule,
    testsTypescriptEslintParser
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v2"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@2.x",
    ReactHooksESLintRule,
    testsTypescriptEslintParser
  );

  // // TypeError: Class extends value undefined is not a constructor or null
  // new ESLintTesterV7({
  //   parser: require.resolve("@typescript-eslint/parser-v3"),
  //   parserOptions: parserOptionsV7,
  // }).run(
  //   "eslint: v7, parser: @typescript-eslint/parser@3.x",
  //   ReactHooksESLintRule,
  //   testsTypescriptEslintParser
  // );

  // new ESLintTesterV9({
  //   languageOptions: {
  //     ...languageOptionsV9,
  //     parser: require("@typescript-eslint/parser-v3"),
  //   },
  // }).run(
  //   "eslint: v9, parser: @typescript-eslint/parser@3.x",
  //   ReactHooksESLintRule,
  //   testsTypescriptEslintParser
  // );

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v4"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@4.x",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v4"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@4.x",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v5"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@^5.0.0-0",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v5"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@^5.0.0",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );
});

describe("better-exhaustive-deps/staticHooks", () => {
  // new ESLintTester({
  //   parser: require.resolve("@babel/eslint-parser"),
  //   parserOptions,
  // }).run("parser: @babel/eslint-parser static", ReactHooksESLintRule, tests);

  // new ESLintTester({
  //   parser: require.resolve("@typescript-eslint/parser-v5"),
  //   parserOptions,
  // }).run(
  //   "parser: @typescript-eslint/parser@^5.0.0-0 static",
  //   ReactHooksESLintRule,
  //   tests
  // );

  const testsBabelEslint = testStaticHooks;

  // new ESLintTesterV7({
  //   parser: require.resolve("babel-eslint"),
  //   parserOptions: parserOptionsV7,
  // }).run(
  //   "eslint: v7, parser: babel-eslint",
  //   ReactHooksESLintRule,
  //   testsBabelEslint
  // );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@babel/eslint-parser"),
    },
  }).run(
    "eslint: v9, parser: @babel/eslint-parser",
    ReactHooksESLintRule,
    testsBabelEslint
  );

  const testsTypescriptEslintParser = testStaticHooks;

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v2"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@2.x",
    ReactHooksESLintRule,
    testsTypescriptEslintParser
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v2"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@2.x",
    ReactHooksESLintRule,
    testsTypescriptEslintParser
  );

  // // TypeError: Class extends value undefined is not a constructor or null
  // new ESLintTesterV7({
  //   parser: require.resolve("@typescript-eslint/parser-v3"),
  //   parserOptions: parserOptionsV7,
  // }).run(
  //   "eslint: v7, parser: @typescript-eslint/parser@3.x",
  //   ReactHooksESLintRule,
  //   testsTypescriptEslintParser
  // );

  // new ESLintTesterV9({
  //   languageOptions: {
  //     ...languageOptionsV9,
  //     parser: require("@typescript-eslint/parser-v3"),
  //   },
  // }).run(
  //   "eslint: v9, parser: @typescript-eslint/parser@3.x",
  //   ReactHooksESLintRule,
  //   testsTypescriptEslintParser
  // );

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v4"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@4.x",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v4"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@4.x",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV7({
    parser: require.resolve("@typescript-eslint/parser-v5"),
    parserOptions: parserOptionsV7,
  }).run(
    "eslint: v7, parser: @typescript-eslint/parser@^5.0.0-0",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );

  new ESLintTesterV9({
    languageOptions: {
      ...languageOptionsV9,
      parser: require("@typescript-eslint/parser-v5"),
    },
  }).run(
    "eslint: v9, parser: @typescript-eslint/parser@^5.0.0",
    ReactHooksESLintRule,
    {
      valid: [...testsTypescriptEslintParser.valid],
      invalid: [...testsTypescriptEslintParser.invalid],
    }
  );
});
