/**
 * @jest-environment ./__test__/env/backend/CustomLibTestEnv.ts
 */
import { testApiHandler } from "next-test-api-route-handler";
import { connectMongoDB } from "@/lib/mongodb";
import * as appHandler from "@/app/api/pusher-auth/route";

jest.mock("@/socketi", () => ({
  pusherServer: {
    authorizeChannel: () => {},
  },
}));

describe("Pusher auth", () => {
  beforeAll(async () => {
    process.env = {
      ...process.env,
      MONGODB_URI: (global as any).__MONGO_URI__,
    };
    // @ts-ignore
    (global as any).fetch = jest.fn((url) =>
      Promise.resolve({
        json: () => Promise.resolve({ title: "Test Video" }),
      }),
    );
    await connectMongoDB();
  });

  afterAll((done) => {
    (global as any).client.connection.close();
    done();
  });

  test("Call GET", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const query = `query { hello }`;

        const res = await fetch({
          method: "POST",
          headers: {
            "content-type": "application/json", // Must use correct content type
          },
          body: JSON.stringify({ query }),
        });

        expect(res.status).toEqual(200)
      },
    });
  });
});
