import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("uses the shared directional-fill interaction without zoom classes", () => {
    render(<Button>Continue</Button>);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.className).toContain("hover:bg-[length:100%_100%]");
    expect(button.className).not.toMatch(/hover:scale|hover:-translate/);
  });

  it("retains accessible disabled semantics", () => {
    render(<Button disabled>Saving</Button>);
    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
  });
});
