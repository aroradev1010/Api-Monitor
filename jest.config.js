/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["./.jest/setEnvVars.js"],
  testTimeout: 50000,
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transformIgnorePatterns: ["/node_modules/(?!(get-port|other-esm-deps)/)"],
};
