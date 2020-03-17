import { buildSchema } from "type-graphql";
import { HelloResolver } from "../authentication/Hello";
import { RegisterResolver } from "../authentication/Register";
import { ConfirmEmailResolver } from "../authentication/ConfirmEmail";
import { LoginResolver } from "../authentication/Login";
import { LogoutResolver } from "../authentication/Logout";

export const graphqlSchema = buildSchema({
  resolvers: [
    HelloResolver,
    RegisterResolver,
    ConfirmEmailResolver,
    LoginResolver,
    LogoutResolver
  ]
});
