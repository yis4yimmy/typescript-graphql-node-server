import { ObjectBlueprint } from "@entity-factory/core";
import { User } from "../entity/User";

export class UserBlueprint extends ObjectBlueprint<User> {
  constructor() {
    super();

    this.type(User);

    this.define(async ({ faker }) => ({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }));

    this.state("verified", async () => ({
      verified: true
    }));

    this.state("locked", async () => ({
      locked: true
    }));
  }
}
