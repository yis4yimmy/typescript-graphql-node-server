import { v4 as generateV4Uuid } from "uuid";
import { Redis } from "ioredis";

interface ConfirmEmailParams {
  id: string;
}

export const createConfirmEmailIUrl = async (
  params: ConfirmEmailParams,
  redisClient: Redis
): Promise<string | Error> => {
  const { HOST_URL, PORT } = process.env;
  const { id: userId } = params;

  const redisKey = generateV4Uuid();

  const result = await redisClient.set(redisKey, userId, "EX", 60 * 60 * 24);

  if (result !== "OK") {
    return new Error("Could not create a confirmation email url.");
  }

  return `${HOST_URL}:${PORT}/authentication/confirmEmail/${redisKey}`;
};
