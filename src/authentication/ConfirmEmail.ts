import { Resolver, Mutation, Arg } from "type-graphql";
import { redisClient } from "../services/redis";
import { User } from "../entity/User";

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg("token") token: string): Promise<boolean> {
    const userId = await redisClient.get(token);

    if (!userId) {
      return false;
    }

    let result: boolean = false;
    await User.update(userId, { verified: true })
      .then(() => {
        result = true;
        redisClient.del(token);
      })
      .catch(error => {
        console.log(error);
      });

    return result;
  }
}
