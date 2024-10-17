/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    "^@handlers/(.*)$": "<rootDir>/src/handlers/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@dto/(.*)$": "<rootDir>/src/dto/$1",
  },
};