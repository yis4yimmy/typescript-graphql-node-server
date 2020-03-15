/* global jest */

import { redisClient } from "../services/redis";
import { createConfirmEmailIUrl } from "./createConfirmEmailUrl";

describe("createConfirmEmailUrl", () => {
  const userId = "321cba";
  let redisClientSpy: jest.SpyInstance;

  beforeEach(() => {
    redisClientSpy = jest.spyOn(redisClient, "set");
  });

  afterEach(() => {
    redisClientSpy.mockRestore();
  });

  afterAll(() => {
    redisClient.disconnect();
  });

  describe("failed url creation", () => {
    let result: string | Error;

    beforeEach(async () => {
      redisClientSpy.mockImplementationOnce(() => "Error");

      result = await createConfirmEmailIUrl({ id: userId }, redisClient);
    });

    it("sets the token and userId in Redis with an 86400 second expiry time", () => {
      expect(redisClientSpy.mock.calls[0][1]).toEqual(userId);
      expect(redisClientSpy.mock.calls[0][2]).toEqual("EX");
      expect(redisClientSpy.mock.calls[0][3]).toEqual(60 * 60 * 24);
    });

    it("returns an error", () => {
      expect(result).toBeInstanceOf(Error);
    });
  });

  describe("successful url creation", () => {
    let result: string | Error;

    beforeEach(async () => {
      redisClientSpy.mockImplementationOnce(() => "OK");

      result = await createConfirmEmailIUrl({ id: userId }, redisClient);
    });

    it("sets the token and userId in Redis with an 86400 second expiry time", () => {
      expect(redisClientSpy.mock.calls[0][1]).toEqual(userId);
      expect(redisClientSpy.mock.calls[0][2]).toEqual("EX");
      expect(redisClientSpy.mock.calls[0][3]).toEqual(60 * 60 * 24);
    });

    it("returns a url with the confirmation token as a url param", () => {
      expect(result).toMatch(
        /http:\/\/localhost:4000\/authentication\/confirmEmail\//
      );
    });
  });
});
