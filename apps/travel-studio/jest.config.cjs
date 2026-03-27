/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/core$": "<rootDir>/../../packages/core",
    "^@/core/(.*)$": "<rootDir>/../../packages/core/$1",
  },
};
