import dotenv from "dotenv";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import connectRedis from "connect-redis";
import session from "express-session";
import { Redis } from "ioredis";
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

  app.use(cors({ credentials: true, origin: process.env.FRONT_END_HOST_URL }));

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({ client: redisClient as Redis }),
      name: "tid",
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30
      }
    })
  );

  const schema = await graphqlSchema;

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ redisClient, req, res })
  });

  server.applyMiddleware({ app, cors: false });

  const { HOST_URL, PORT, NODE_ENV } = process.env;

  app.listen({ port: PORT }, () => {
    console.log(`Running a ${NODE_ENV} server at ${HOST_URL}:${PORT}/graphql`);
  });
})();
