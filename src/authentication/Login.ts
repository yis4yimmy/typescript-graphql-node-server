import argon2 from "argon2";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { AppContext } from "../types/AppContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => Boolean)
  async login(
    @Arg("emailOrUsername") emailOrUsername: string,
    @Arg("password") password: string,
    @Ctx() ctx: AppContext
  ): Promise<boolean> {
    const user = await User.findOneByEmailOrUsername(emailOrUsername);

    if (!user) {
      return false;
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return false;
    }

    if (!user.verified) {
      return false;
    }

    if (!ctx.req.session) {
      return false;
    }

    ctx.req.session.userId = user.id;

    return true;
  }
}
