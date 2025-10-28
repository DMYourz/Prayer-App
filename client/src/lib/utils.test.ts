import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("joins class names while ignoring falsy values", () => {
    expect(
      cn("px-4", ["py-2", undefined], { "text-lg": true, hidden: false })
    ).toBe("px-4 py-2 text-lg");
  });
});
