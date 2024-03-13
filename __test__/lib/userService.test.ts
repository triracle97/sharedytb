/**
 * @jest-environment ./__test__/env/backend/CustomLibTestEnv.ts
 */
import { Mongoose } from "mongoose";
import { signInWithCredentials } from "@/lib/userService";

describe("User service test", () => {

  beforeAll(() => {
    process.env = {
      ...process.env,
      MONGODB_URI: (global as any).__MONGO_URI__,
    };
  });

  afterAll(done => {
    (global as any).client.connection.close();
    done();
  })

  test("Test sign in with non exists credentials", async () => {
    const user = await signInWithCredentials("test@gmail.com", "123456");
    expect(user.email).toEqual("test@gmail.com");
  });

  test("Test sign in with exists credentials and wrong password", async () => {
    const user = await signInWithCredentials("test@gmail.com", "1234567");
    expect(user).toEqual(null);
  });

  test("Test sign in with exists credentials", async () => {
    const user = await signInWithCredentials("test@gmail.com", "123456");
    expect(user.email).toEqual("test@gmail.com");
  });
});
