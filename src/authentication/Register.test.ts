/* global jest */

import gql from "graphql-tag";
import { DocumentNode, GraphQLError } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-testing";
import { createTestServer } from "../test-utils/createTestServer";
import { connection, factory } from "../test-utils/setupDatabaseConnections";
import { User } from "../entity/User";
import { sendMail } from "../services/sendMail";

jest.mock("../services/sendMail");

const registerMutation: DocumentNode = gql`
  mutation register($formData: RegisterInput!) {
    register(formData: $formData) {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
`;

describe("Register", () => {
  let testServer: ApolloServer;
  const username: string = "jimmy";
  const email: string = "jimmy@gmail.com";
  const password: string = "notHashed!";

  beforeAll(async () => {
    testServer = await createTestServer();
  });

  describe("when the username is taken", () => {
    let result: GraphQLResponse;
    let duplicateUser: User;

    beforeAll(async () => {
      duplicateUser = await factory
        .for(User)
        .with({ username })
        .create();

      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: registerMutation,
        variables: {
          formData: {
            username,
            email,
            password
          }
        }
      });
    });

    afterAll(async () => {
      await connection.manager.delete(User, duplicateUser.id);
    });

    it("returns an error", () => {
      expect(result.errors![0]).toBeInstanceOf(GraphQLError);
    });

    it("does not create the user record", async () => {
      const user = await connection.manager.findOne(User, { where: { email } });
      expect(user).toBeUndefined();
    });

    it("does not send a confirmation email", () => {
      expect(sendMail).not.toHaveBeenCalled();
    });
  });

  describe("when the email is taken", () => {
    let result: GraphQLResponse;
    let duplicateUser: User;

    beforeAll(async () => {
      duplicateUser = await factory
        .for(User)
        .with({ email })
        .create();

      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: registerMutation,
        variables: {
          formData: {
            username,
            email,
            password
          }
        }
      });
    });

    afterAll(async () => {
      await connection.manager.delete(User, duplicateUser.id);
    });

    it("returns an error", () => {
      expect(result.errors![0]).toBeInstanceOf(GraphQLError);
    });

    it("does not create the user record", async () => {
      const user = await connection.manager.findOne(User, {
        where: { username }
      });
      expect(user).toBeUndefined();
    });

    it("does not send a confirmation email", () => {
      expect(sendMail).not.toHaveBeenCalled();
    });
  });

  describe("when the password is invalid", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: registerMutation,
        variables: {
          formData: {
            username,
            email,
            password: "weak"
          }
        }
      });
    });

    it("returns an error", () => {
      expect(result.errors![0]).toBeInstanceOf(GraphQLError);
    });

    it("does not create the user record", async () => {
      const user = await connection.manager.findOne(User, {
        where: { username }
      });
      expect(user).toBeUndefined();
    });

    it("does not send a confirmation email", () => {
      expect(sendMail).not.toHaveBeenCalled();
    });
  });

  describe("when all fields are valid", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient(testServer);
      result = await mutate({
        mutation: registerMutation,
        variables: {
          formData: {
            username,
            email,
            password
          }
        }
      });
    });

    it("returns the user", () => {
      expect(result!.data!.register).toMatchObject({ username, email });
    });

    it("stores a hashed password", async () => {
      const user = await connection.manager.findOne(User, {
        where: { email }
      });

      expect(user!.password).not.toEqual(password);
    });

    it("sends a confirmation email", () => {
      expect(sendMail).toHaveBeenCalled();
    });
  });
});
