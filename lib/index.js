/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

const BetterExhaustiveDeps = require("./rules/BetterExhaustiveDeps");

const configs = {
  recommended: {
    plugins: ["better-exhaustive-deps"],
    rules: {
      "better-exhaustive-deps/exhaustive-deps": "warn",
    },
  },
};

const rules = {
  "exhaustive-deps": BetterExhaustiveDeps,
};

module.exports = {};
