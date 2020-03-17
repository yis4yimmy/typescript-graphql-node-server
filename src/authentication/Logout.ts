import { Resolver, Mutation, Ctx } from "type-graphql";
import { AppContext } from "../types/AppContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: AppContext): Promise<boolean> {
    return new Promise(resolve => {
      if (!ctx.req.session) {
        return resolve(false);
      }

      ctx.req.session.destroy(error => {
        if (error) {
          if (process.env.NODE_ENV === "development") {
            console.log("Session destroy error: ", error);
          }
          return resolve(false);
        }

        ctx.res.clearCookie("tid");
        return resolve(true);
      });
    });
  }
}
