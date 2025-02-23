"use strict";

const ReactHooksESLintRule = require("../lib/rules/BetterExhaustiveDeps.js");
const ESLintTester = require("eslint").RuleTester;

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
const tests = {
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

// For easier local testing
if (!process.env.CI) {
  let only = [];
  let skipped = [];
  [...tests.valid, ...tests.invalid].forEach((t) => {
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
  tests.valid = tests.valid.filter(predicate);
  tests.invalid = tests.invalid.filter(predicate);
}

describe("checkMemoizedVariableIsStatic", () => {
  const parserOptions = {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: "module",
  };

  new ESLintTester({
    parser: require.resolve("@babel/eslint-parser"),
    parserOptions,
  }).run("parser: @babel/eslint-parser static", ReactHooksESLintRule, tests);

  new ESLintTester({
    parser: require.resolve("@typescript-eslint/parser-v5"),
    parserOptions,
  }).run(
    "parser: @typescript-eslint/parser@^5.0.0-0 static",
    ReactHooksESLintRule,
    tests
  );
});
