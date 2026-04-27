import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileMenuToggle } from "../MobileMenuToggle";

describe("<MobileMenuToggle />", () => {
  it("should render the open menu icon when closed", () => {
    render(<MobileMenuToggle isOpen={false} onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  it("should render the close icon when open", () => {
    render(<MobileMenuToggle isOpen={true} onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeInTheDocument();
  });

  it("should call onToggle when clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<MobileMenuToggle isOpen={false} onToggle={onToggle} />);

    await user.click(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
