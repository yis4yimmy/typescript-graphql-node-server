import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { AppContext } from "../types/AppContext";

@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(
    @Arg("token") token: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    const { redisClient } = ctx;

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
