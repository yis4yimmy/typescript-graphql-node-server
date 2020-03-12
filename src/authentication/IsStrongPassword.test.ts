import { strongPassword } from "./IsStrongPassword";

describe("strongPassword RegExp", () => {
  describe("invalid passwords", () => {
    it.each([
      ["is empty", ""],
      ["is only lowercase", "ab6"],
      ["is only uppercase", "AB6"],
      ["is only alpha", "aB"],
      ["is only numeric", "567"],
      ["is only special characters", "!@#"],
      ["has invalid special characters", "aB~"],
      ["is valid but contains an invalid character", "aB~1"],
      ["is only numeric and special characters", "5!4"]
    ])(
      "returns false if the password %s",
      (_description: string, password: string) => {
        expect(strongPassword.test(password)).toEqual(false);
      }
    );
  });

  describe("valid passwords", () => {
    it.each([
      ["has uppercase and lowercase letters and a number", "aB1"],
      ["has uppercase and lowercase letters and a special character", "aB!"],
      [
        "has uppercase and lowercase letters, a number, and a special character",
        "aB1!"
      ]
    ])(
      "returns true if the password %s",
      (_description: string, password: string) => {
        expect(strongPassword.test(password)).toEqual(true);
      }
    );
  });
});
