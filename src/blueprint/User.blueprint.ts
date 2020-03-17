import argon2 from "argon2";
import { ObjectBlueprint } from "@entity-factory/core";
import { User } from "../entity/User";

export class UserBlueprint extends ObjectBlueprint<User> {
  constructor() {
    super();

    this.type(User);

    this.define(async ({ faker }) => {
      const hashedPassword = await argon2.hash(faker.internet.password());

      return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedPassword
      };
    });

    this.state("verified", async () => ({
      verified: true
    }));

    this.state("locked", async () => ({
      locked: true
    }));
  }
}
