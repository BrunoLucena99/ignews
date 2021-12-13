module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "./next"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "src/**/*.{ts,tsx}",
    "!src/**/*.spec.tsx",
    "!src/pages/api/**",
    "!src/services/**",
    "!src/pages/_*.tsx",
  ],
  coverageReporters: ["lcov", "json"]
};