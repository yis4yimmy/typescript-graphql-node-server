module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/src/test-utils/setupDatabaseConnections.ts"]
};
