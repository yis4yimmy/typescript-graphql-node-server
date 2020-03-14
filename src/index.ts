import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./authentication/Register";
import { ConfirmEmailResolver } from "./authentication/ConfirmEmail";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello, world!";
  }
}

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

  const schema = await buildSchema({
    resolvers: [HelloResolver, RegisterResolver, ConfirmEmailResolver]
  });

  const server = new ApolloServer({ schema });

  server.applyMiddleware({ app });

  const { HOST_URL, PORT, NODE_ENV } = process.env;

  app.listen({ port: PORT }, () => {
    console.log(`Running a ${NODE_ENV} server at ${HOST_URL}:${PORT}/graphql`);
  });
})();
