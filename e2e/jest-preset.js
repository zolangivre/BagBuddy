module.exports = {
  testEnvironment: "node",
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: ["./init.js"],
  reporters: ["detox/runners/jest/reporter"],
  testTimeout: 120000,
};
