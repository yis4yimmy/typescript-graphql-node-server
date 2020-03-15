import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { graphqlSchema } from "./services/graphqlSchema";
import { redisClient } from "./services/redis";

(async function() {
  dotenv.config();

  createConnection()
    .then(_connection => {
      console.log("Created a connection");
    })
    .catch(error => {
      console.error(error);
    });

  const app = express();

  const schema = await graphqlSchema;

  const server = new ApolloServer({ schema, context: { redisClient } });

  server.applyMiddleware({ app });

  const { HOST_URL, PORT, NODE_ENV } = process.env;

  app.listen({ port: PORT }, () => {
    console.log(`Running a ${NODE_ENV} server at ${HOST_URL}:${PORT}/graphql`);
  });
})();
