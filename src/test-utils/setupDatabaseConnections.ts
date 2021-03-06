import {
  getConnectionManager,
  ConnectionOptions,
  Connection,
  BaseEntity
} from "typeorm";
import { EntityFactory } from "@entity-factory/core";
import { TypeormAdapter } from "@entity-factory/typeorm";
import { connectionName } from "./constants";
import { redisClient } from "../services/redis";
import { UserBlueprint } from "../blueprint/User.blueprint";

const connectionOptions: ConnectionOptions = {
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
};

let connection: Connection;

let factory: EntityFactory;

beforeAll(async () => {
  const connectionManager = getConnectionManager();
  connection = connectionManager.create(connectionOptions);
  await connection.connect();

  BaseEntity.useConnection(connection);

  const adapter: TypeormAdapter = new TypeormAdapter(connectionOptions);
  factory = new EntityFactory({
    adapter,
    blueprints: [UserBlueprint]
  });
});

afterAll(async () => {
  redisClient.disconnect();
  await connection.close();
});

export { connection, factory, redisClient };
