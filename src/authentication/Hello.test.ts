import gql from "graphql-tag";
import { createTestClient } from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { createTestServer } from "../test-utils/createTestServer";

const helloQuery: DocumentNode = gql`
  query {
    hello
  }
`;

describe("Hello", () => {
  let testServer: ApolloServer;

  beforeAll(async () => {
    testServer = await createTestServer();
  });

  it("returns the string 'Hello, world!'", async () => {
    const { query } = createTestClient(testServer);
    const { data } = await query({ query: helloQuery });
    expect(data).toEqual({ hello: "Hello, world!" });
  });
});
