import { getConnectionManager } from "typeorm";
import { connectionName } from "./constants";

(async () => {
  console.info("Starting DB teardown...");
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
    dropSchema: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/*.ts"],
    cli: { migrationsDir: "src/migration" }
  });
  await connection.connect();

  await connection.close();
  console.info("DB teardown complete");
})();
