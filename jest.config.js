"use strict";

process.env.NODE_ENV = "development";

module.exports = {
  setupFiles: [require.resolve("./scripts/setupJestEnvironment.js")],
  moduleFileExtensions: ["ts", "js", "json"],
};
