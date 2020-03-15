import { ApolloServer } from "apollo-server-express";
import { graphqlSchema } from "../services/graphqlSchema";
import { redisClient } from "./setupDatabaseConnections";

export const createTestServer = async () => {
  const schema = await graphqlSchema;
  const testServer = new ApolloServer({ schema, context: { redisClient } });

  return testServer;
};
