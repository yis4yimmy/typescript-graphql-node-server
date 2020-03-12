import "reflect-metadata";
import { createConnection } from "typeorm";

createConnection()
  .then(_connection => {
    console.log("Created a connection");
  })
  .catch(error => {
    console.error(error);
  });
