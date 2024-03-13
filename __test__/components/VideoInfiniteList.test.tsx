/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, act, cleanup } from "@testing-library/react";
import VideoInfiniteList from "@/components/VideoInfiniteList";
import userEvent from "@testing-library/user-event";

const pushFn = jest.fn();

const mockData1 = [
  {
    link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb",
    sharedBy: "test@gmail.com",
    name: "test",
    _id: 1,
  },
  {
    link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb1",
    sharedBy: "test1@gmail.com",
    name: "test1",
    _id: 2,
  },
];

const mockData2 = [
  {
    link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb2",
    sharedBy: "test2@gmail.com",
    name: "test2",
    _id: 3,
  },
  {
    link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb3",
    sharedBy: "test3@gmail.com",
    name: "test3",
    _id: 4,
  },
  {
    link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb4",
    sharedBy: "test4@gmail.com",
    name: "test4",
    _id: 5,
  },
];

let addVideoCb: Function;
let testCallFn: Function;

jest.mock("@/socketi", () => ({
  pusherClient: {
    subscribe: (channelName: string) => ({
      bind: (eventName: string, cb: Function) => {
        addVideoCb = cb;
        return {
          unbind: () => {},
        };
      },
    }),
  },
}));
jest.mock("next-auth/react", () => ({
  useSession: () => ({}),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushFn,
  }),
}));

function scroll(scrollTop: number, offsetHeight: number) {
  const event = document.createEvent("Event");
  event.initEvent("scroll", true, true);

  Object.defineProperty(document.documentElement, "scrollTop", {
    writable: true,
    configurable: true,
    value: scrollTop,
  });
  Object.defineProperty(document.documentElement, "offsetHeight", {
    writable: true,
    configurable: true,
    value: offsetHeight,
  });
  window.dispatchEvent(event);
}

describe("VideoInfiniteList", () => {
  beforeEach(() => {
    window.scrollTo = () => {};
    (global as any).fetch = jest.fn((url) => {
      testCallFn && testCallFn();
      if (url.includes("_page=2")) {
        return Promise.resolve({
          json: () => Promise.resolve(null),
        });
      } else if (url.includes("_page=0")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              sharedLink: mockData1,
            }),
        });
      } else if (url.includes("_page=1")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              sharedLink: mockData2,
            }),
        });
      }
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("render empty", async () => {
    (global as any).fetch = jest.fn((url) => {
      testCallFn && testCallFn();
      if (url.includes("_page=0")) {
        return Promise.resolve({
          json: () => Promise.resolve(null),
        });
      }
    });
    testCallFn = jest.fn();

    await act(async () => {
      render(<VideoInfiniteList />);
    });
    const emptyText = screen.getByText("There is no shared link now", {
      exact: false,
    });
    expect(emptyText).toBeInTheDocument();
    expect(testCallFn).toHaveBeenCalledTimes(1);
  });

  test("render correctly", async () => {
    testCallFn = jest.fn();

    await act(async () => {
      render(<VideoInfiniteList />);
    });

    await act(async () => {
      scroll(50, 50);
    });
    const video0 = screen.getByText("test");
    const video1 = screen.getByText("test4");
    expect(video0).toBeInTheDocument();
    expect(video1).toBeInTheDocument();
    expect(testCallFn).toHaveBeenCalledTimes(2);
  });

  test("new video added", async () => {
    await act(async () => {
      render(<VideoInfiniteList />);
    });

    await act(async () => {
      addVideoCb({
        link: "https://www.youtube.com/watch?v=c0DxXddfBigrU&ab_channel=abdfhikb5",
        sharedBy: "test2@gmail.com",
        name: "test5",
        _id: 5,
      });
    });

    const goToTopText = screen.getByText("Go to top and reload", {
      exact: false,
    });
    expect(goToTopText).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(goToTopText);
    });
    const video = screen.getByText("test5");
    expect(video).toBeInTheDocument();
  });
});
