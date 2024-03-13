/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ShareVideoForm from "@/components/ShareVideoForm";
import userEvent from "@testing-library/user-event";

const pushFn = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushFn,
  }),
}));

describe("ShareVideoForm", () => {
  beforeAll(() => {
    (global as any).fetch = jest.fn((url) =>
      Promise.resolve({
        ok: 1,
      }),
    );
  });

  test("render correctly", () => {
    render(<ShareVideoForm />);

    const input = screen.getByPlaceholderText("Link");
    const button = screen.getByRole("button");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("should display error message when submitting with empty link", async () => {
    render(<ShareVideoForm />);

    const button = screen.getByRole("button");

    await userEvent.click(button);

    const errorText = screen.getByText("All fields are necessary.");
    expect(errorText).toBeInTheDocument();
  });

  test("should display error message when submitting with empty link", async () => {
    render(<ShareVideoForm />);

    const input = screen.getByPlaceholderText("Link");
    const button = screen.getByRole("button");

    await userEvent.type(input, "link");
    await userEvent.click(button);
    expect(pushFn).toHaveBeenCalled();
  });
});
