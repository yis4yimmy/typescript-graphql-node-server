/* global jest */

import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { createTestClient } from "apollo-server-integration-testing";
import { createTestServer } from "../test-utils/createTestServer";

const logoutMutation: DocumentNode = gql`
  mutation logout {
    logout
  }
`;

describe("Logout", () => {
  let testServer: ApolloServer;

  beforeAll(async () => {
    testServer = await createTestServer();
  });

  describe("when the user is not logged in", () => {
    let result: GraphQLResponse;

    beforeAll(async () => {
      const { mutate } = createTestClient({ apolloServer: testServer });

      result = await mutate(logoutMutation);
    });

    it("returns false", () => {
      expect(result.data).toEqual({ logout: false });
    });
  });

  describe("when the user is logged in", () => {
    let result: GraphQLResponse;
    let destroyMock: jest.Mock;

    afterEach(() => {
      destroyMock.mockRestore();
    });

    describe("when the session destruction fails", () => {
      beforeAll(async () => {
        destroyMock = jest.fn(errorResponse => {
          return errorResponse(true);
        });
        const { mutate } = createTestClient({
          apolloServer: testServer,
          extendMockRequest: { session: { destroy: destroyMock } as any }
        });

        result = await mutate(logoutMutation);
      });

      it("returns false", () => {
        expect(result.data).toEqual({ logout: false });
      });
    });

    describe("when the user is logged out successfully", () => {
      beforeAll(async () => {
        destroyMock = jest.fn(errorResponse => {
          return errorResponse(false);
        });
        const { mutate } = createTestClient({
          apolloServer: testServer,
          extendMockRequest: { session: { destroy: destroyMock } as any }
        });

        result = await mutate(logoutMutation);
      });

      it("returns true", () => {
        expect(result.data).toEqual({ logout: true });
      });
    });
  });
});
