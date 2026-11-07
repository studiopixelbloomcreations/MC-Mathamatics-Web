import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/ui/pin-input";
import { Badge } from "@/components/ui/badge";

describe("UI Kit Components", () => {
  it("renders Button correctly with text", () => {
    render(<Button variant="primary">Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders Badge with dot indicator", () => {
    render(<Badge variant="accent" dot>Status Badge</Badge>);
    expect(screen.getByText("Status Badge")).toBeInTheDocument();
  });

  it("renders PinInput with 6 input slots and handles typing", () => {
    let completedPin = "";
    render(
      <PinInput
        length={6}
        onComplete={(pin) => {
          completedPin = pin;
        }}
      />
    );
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    fireEvent.change(inputs[0], { target: { value: "1" } });
    expect((inputs[0] as HTMLInputElement).value).toBe("1");
  });
});
