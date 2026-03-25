import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(ml-levenberg-marquardt|ml-array-rescale|ml-array-min|ml-array-max|is-any-array)/)",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": ["ts-jest", { useESM: false }],
  },
};

export default config;
