import argon2 from "argon2";
import { Resolver, Mutation, Arg } from "type-graphql";
import { RegisterInput } from "./RegisterInput";
import { User } from "../entity/User";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("formData") { username, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    const user = User.create({
      username,
      email,
      password: hashedPassword
    });
    const result = await user.save();

    return result;
  }
}
