import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./authentication/Register";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello, world!";
  }
}

(async function() {
  createConnection()
    .then(_connection => {
      console.log("Created a connection");
    })
    .catch(error => {
      console.error(error);
    });

  const app = express();

  const schema = await buildSchema({
    resolvers: [HelloResolver, RegisterResolver],
    validate: false
  });

  const server = new ApolloServer({ schema });

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log("Server running at http://localhost:4000/graphql");
  });
})();