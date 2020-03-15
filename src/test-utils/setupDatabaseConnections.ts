import { getConnection, getConnectionManager } from "typeorm";
import { connectionName } from "./constants";
import { redisClient } from "../services/redis";

beforeAll(async () => {
  const connectionManager = getConnectionManager();
  const connection = connectionManager.create({
    name: connectionName,
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "jamesschuster",
    password: "",
    database: "ts-server-test",
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/*.ts"],
    cli: { migrationsDir: "src/migration" }
  });
  await connection.connect();
});

afterAll(async () => {
  redisClient.disconnect();
  await getConnection(connectionName).close();
});

export { redisClient };
