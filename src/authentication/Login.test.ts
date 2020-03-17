/* global jest */

import argon2 from "argon2";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-integration-testing";
import { createTestServer } from "../test-utils/createTestServer";
import { factory } from "../test-utils/setupDatabaseConnections";
import { User } from "../entity/User";

const loginMutation: DocumentNode = gql`
  mutation login($emailOrUsername: String!, $password: String!) {
    login(emailOrUsername: $emailOrUsername, password: $password)
  }
`;

describe("Login", () => {
  let testServer: ApolloServer;
  let testPassword: string;
  let testUser: User;

  beforeAll(async () => {
    testServer = await createTestServer();

    testPassword = "TestP@ss";
    const hashedPassword = await argon2.hash(testPassword);
    testUser = await factory
      .for(User)
      .with({ password: hashedPassword })
      .state("verified")
      .create();
  });

  describe("when the email provided does not exist", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient({ apolloServer: testServer });
      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: "jimmy@email.com",
          password: testUser.password
        }
      });
    });

    it("returns false", () => {
      expect(result.data).toEqual({ login: false });
    });
  });

  describe("when the username provided does not exist", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient({ apolloServer: testServer });
      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: "not_a_username",
          password: testUser.password
        }
      });
    });

    it("returns false", () => {
      expect(result.data).toEqual({ login: false });
    });
  });

  describe("when the password is incorrect", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient({ apolloServer: testServer });
      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: testUser.email,
          password: "bad-password"
        }
      });
    });

    it("returns false", () => {
      expect(result.data).toEqual({ login: false });
    });
  });

  describe("when the email hasn't been verified", () => {
    let result: GraphQLResponse;

    let unverifiedUser: User;
    let unverifiedUserPassword: string;

    beforeAll(async () => {
      unverifiedUserPassword = "TestP@ss";
      const hashedPassword = await argon2.hash(unverifiedUserPassword);
      unverifiedUser = await factory
        .for(User)
        .with({ password: hashedPassword })
        .create();

      const { mutate } = createTestClient({ apolloServer: testServer });
      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: unverifiedUser.email,
          password: unverifiedUser.password
        }
      });
    });

    it("returns false", () => {
      expect(result.data).toEqual({ login: false });
    });
  });

  describe("when the account is locked", () => {
    let result: GraphQLResponse;

    let lockedUser: User;
    let lockedUserPassword: string;

    beforeAll(async () => {
      lockedUserPassword = "TestP@ss";
      const hashedPassword = await argon2.hash(lockedUserPassword);
      lockedUser = await factory
        .for(User)
        .state("locked")
        .with({ password: hashedPassword })
        .create();

      const { mutate } = createTestClient({ apolloServer: testServer });
      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: lockedUser.email,
          password: lockedUser.password
        }
      });
    });

    it("returns false", () => {
      expect(result.data).toEqual({ login: false });
    });
  });

  describe("when everything is correct", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient({
        apolloServer: testServer,
        extendMockRequest: { session: {} }
      });

      result = await mutate(loginMutation, {
        variables: {
          emailOrUsername: testUser.email,
          password: testPassword
        }
      });
    });

    it("returns true", () => {
      expect(result.data).toEqual({ login: true });
    });
  });
});
