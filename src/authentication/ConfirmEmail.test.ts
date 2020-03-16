import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-testing";
import { createTestServer } from "../test-utils/createTestServer";
import {
  connection,
  factory,
  redisClient
} from "../test-utils/setupDatabaseConnections";
import { User } from "../entity/User";

const confirmMutation: DocumentNode = gql`
  mutation confirmEmail($token: String!) {
    confirmEmail(token: $token)
  }
`;

describe("ConfirmEmail", () => {
  let testServer: ApolloServer;
  let testUser: User;

  beforeAll(async () => {
    testServer = await createTestServer();

    testUser = await factory.for(User).create();
  });

  describe("when the token doesn't exist", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: confirmMutation,
        variables: { token: "not-gonna-be-there" }
      });
    });

    it("returns false", async () => {
      expect(result.data).toEqual({ confirmEmail: false });
    });

    it("does not update the user record", async () => {
      const user = await connection.manager.findOne(User, testUser.id);
      expect(user).not.toBeUndefined();
      expect(user!.verified).toEqual(false);
    });
  });

  describe("when the token is valid", () => {
    let result: GraphQLResponse;
    const token: string = "valid";

    beforeAll(async () => {
      await redisClient.set(token, testUser.id, "EX", 60 * 60 * 24);

      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: confirmMutation,
        variables: { token }
      });
    });

    it("returns true", () => {
      expect(result.data).toEqual({ confirmEmail: true });
    });

    it("removes the token from redis", async () => {
      const result = await redisClient.get(token);
      expect(result).toBeNull();
    });

    it("updates the user record", async () => {
      const user = await connection.manager.findOne(User, testUser.id);
      expect(user).not.toBeUndefined();
      expect(user!.verified).toEqual(true);
    });
  });
});
