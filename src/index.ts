/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BetterExhaustiveDeps from "./ExhaustiveDeps";
import type { ESLint, Linter, Rule } from "eslint";

const { name, version } = require("../package.json") as {
  name: string;
  version: string;
};

// All rules
const rules = {
  "exhaustive-deps": BetterExhaustiveDeps,
} as const satisfies Record<string, Rule.RuleModule>;

// Config rules
const configRules = {
  "react-hooks/exhaustive-deps": "off",
  "@wogns3623/better-exhaustive-deps/exhaustive-deps": [
    "warn",
    { checkMemoizedVariableIsStatic: true },
  ],
} as const satisfies Linter.RulesRecord;

// Legacy config
const legacyRecommendedConfig = {
  plugins: ["@wogns3623/better-exhaustive-deps"],
  rules: configRules,
} as const satisfies Linter.LegacyConfig;

type ReactHooksFlatConfig = {
  plugins: { react: any };
  rules: typeof configRules;
};

const configs = {
  /** Legacy recommended config, to be used with rc-based configurations */
  "recommended-legacy": legacyRecommendedConfig,

  /**
   * 'recommended' is currently aliased to the legacy / rc recommended config) to maintain backwards compatibility.
   * This is deprecated and in v6, it will switch to alias the flat recommended config.
   */
  recommended: legacyRecommendedConfig,

  /** Latest recommended config, to be used with flat configurations */
  "recommended-latest": {} as ReactHooksFlatConfig,
};

// Plugin object
const plugin = {
  // TODO: Make this more dynamic to populate version from package.json.
  // This can be done by injecting at build time, since importing the package.json isn't an option in Meta
  meta: { name, version },
  rules,
  configs,
} satisfies ESLint.Plugin;

Object.assign(configs, {
  "recommended-latest": {
    name: "@wogns3623/better-exhaustive-deps/recommended",
    plugins: { "@wogns3623/better-exhaustive-deps": plugin },
    rules: configRules,
  } satisfies Linter.Config<Linter.RulesRecord>,
});

export default plugin;

// TODO: If the plugin is ever updated to be pure ESM and drops support for rc-based configs, then it should be exporting the plugin as default
// instead of individual named exports.
// export default plugin;
