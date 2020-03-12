import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { IsStrongPassword } from "./IsStrongPassword";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 15)
  username: string;

  @Field()
  @IsEmail()
  @Length(5, 255)
  email: string;

  @Field()
  @Length(6, 255)
  @IsStrongPassword()
  password: string;
}
