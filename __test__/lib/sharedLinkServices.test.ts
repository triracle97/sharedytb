/**
 * @jest-environment ./__test__/env/backend/CustomLibTestEnv.ts
 */
import { createSharedLink, getSharedLink } from "@/lib/sharedLinkService";
import { connectMongoDB } from "@/lib/mongodb";

const mockData = [
  { link: "linkURL", sharedBy: "test@gmail.com" },
  { link: "linkURL1", sharedBy: "test1@gmail.com" },
  { link: "linkURL2", sharedBy: "test2@gmail.com" },
  { link: "linkURL3", sharedBy: "test3@gmail.com" },
  { link: "linkURL4", sharedBy: "test4@gmail.com" },
  { link: "linkURL", sharedBy: "test@gmail.com" },
  { link: "linkURL1", sharedBy: "test1@gmail.com" },
  { link: "linkURL2", sharedBy: "test2@gmail.com" },
  { link: "linkURL3", sharedBy: "test3@gmail.com" },
  { link: "linkURL4", sharedBy: "test4@gmail.com" },
];

describe("Shared link service test", () => {
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

  test("Create shared link", async () => {
    const result = await createSharedLink(
      { link: "linkURL" },
      "test@gmail.com",
    );
    expect(result.link).toEqual("linkURL");
    expect(result.name).toEqual("Test Video");
    expect(result.sharedBy).toEqual("test@gmail.com");
  });

  test("Create shared link but fail to fetch name", async () => {
    //@ts-ignore
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    try {
      await createSharedLink({ link: "linkURL" }, "test@gmail.com");
    } catch (e) {
      expect(e).toEqual("API is down");
    }
  });

  test("Fetch shared link", async () => {
    // need to create consequently to get correct order
    for (const data of mockData) {
      await createSharedLink({ link: data.link }, data.sharedBy);
    }
    const sharedLink0 = await getSharedLink(0, 3);
    expect(sharedLink0.length).toEqual(3);
    expect(sharedLink0[0].link).toEqual("linkURL4");

    const sharedLink1 = await getSharedLink(1, 3);
    expect(sharedLink1.length).toEqual(3);
    expect(sharedLink1[0].link).toEqual("linkURL1");

    const sharedLink2 = await getSharedLink(0, mockData.length + 2);
    expect(sharedLink2.length).toEqual(mockData.length + 1);
    expect(sharedLink2[mockData.length - 1].link).toEqual("linkURL");
  });
});
