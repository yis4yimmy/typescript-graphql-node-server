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

    if (!user.verified) {
      return false;
    }

    if (user.locked) {
      return false;
    }

    let validPassword: boolean = false;
    try {
      validPassword = await argon2.verify(user.password, password);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("Password validation error: ", error);
      }
      return false;
    }

    if (!validPassword) {
      return false;
    }

    if (!ctx.req.session) {
      return false;
    }

    ctx.req.session.userId = user.id;

    return true;
  }
}
