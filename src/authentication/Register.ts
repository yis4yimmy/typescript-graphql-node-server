import argon2 from "argon2";
import nodemailer from "nodemailer";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { RegisterInput } from "./RegisterInput";
import { User } from "../entity/User";
import { sendMail } from "../services/sendMail";
import { confirmEmail } from "./mailers/confirmEmail";
import { AppContext } from "../types/AppContext";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("formData") { username, email, password }: RegisterInput,
    @Ctx() ctx: AppContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    const user = User.create({
      username,
      email,
      password: hashedPassword
    });
    const result = await user.save();

    const { redisClient } = ctx;

    const confirmationEmail = await confirmEmail(
      {
        userId: user.id,
        userEmail: user.email
      },
      redisClient
    );

    const sentMessageInfo = await sendMail(confirmationEmail);

    console.log("Email url ", nodemailer.getTestMessageUrl(sentMessageInfo));

    return result;
  }
}
