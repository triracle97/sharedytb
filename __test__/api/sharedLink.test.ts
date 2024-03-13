/**
 * @jest-environment ./__test__/env/backend/CustomLibTestEnv.ts
 */
import { testApiHandler } from "next-test-api-route-handler";
import { connectMongoDB } from "@/lib/mongodb";
import { GET, POST } from "@/app/api/sharedLink/route";
import { getServerSession } from "next-auth";
import {createSharedLink} from "@/lib/sharedLinkService";

const appHandler = {
  GET,
  POST,
};
jest.mock("@/socketi", () => ({
  pusherServer: {
    authorizeChannel: () => {},
    trigger: jest.fn(),
  },
}));

jest.mock("next-auth");

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

  test("Call POST with no session", async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(Promise.resolve(null));
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const link = `test`;

        const res = await fetch({
          method: "POST",
          headers: {
            "content-type": "application/json", // Must use correct content type
          },
          body: JSON.stringify({ link }),
        });

        expect(res.status).toEqual(401);
      },
    });
  });

  test("Call POST with session", async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        user: {
          email: "test@gmail.com",
        },
      }),
    );
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const link = `test`;

        const res = await fetch({
          method: "POST",
          headers: {
            "content-type": "application/json", // Must use correct content type
          },
          body: JSON.stringify({ link }),
        });

        expect(res.status).toEqual(200);
        expect(require("@/socketi").pusherServer.trigger).toBeCalled();
      },
    });
  });

  test("Call GET", async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        user: {
          email: "test@gmail.com",
        },
      }),
    );
    await createSharedLink({ link: "linkURL" }, "test@gmail.com");
    await testApiHandler({
      appHandler,
      paramsPatcher(params) {
        params._page = "0";
        params._limit = "10";
      },
      test: async ({ fetch }) => {
        const link = `test`;

        const res = await fetch({
          method: "GET",
        });

        expect((await res.json()).sharedLink.length).toEqual(2);
        expect(res.status).toEqual(200);
      },
    });
  });
});
