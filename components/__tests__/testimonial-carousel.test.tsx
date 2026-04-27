import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestimonialCarousel from "../testimonial-carousel";

describe("<TestimonialCarousel />", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the first testimonial by default", () => {
    render(<TestimonialCarousel />);
    expect(screen.getByText(/Felipe Sasaki/)).toBeInTheDocument();
  });

  it("should advance to the next testimonial when 'Próximo' is clicked", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel />);

    await user.click(screen.getByRole("button", { name: "Próximo depoimento" }));

    expect(screen.getByText(/Lucas Lopes de Souza Guilha/)).toBeInTheDocument();
  });

  it("should wrap around to the last testimonial when going back from the first", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel />);

    await user.click(screen.getByRole("button", { name: "Depoimento anterior" }));

    expect(screen.getByText(/Lucas Lopes de Souza Guilha/)).toBeInTheDocument();
  });

  it("should jump to a specific testimonial via the dot indicator", async () => {
    const user = userEvent.setup();
    render(<TestimonialCarousel />);

    await user.click(screen.getByRole("button", { name: "Ir para depoimento 2" }));

    expect(screen.getByText(/Lucas Lopes de Souza Guilha/)).toBeInTheDocument();
  });

  it("should auto-advance after 10 seconds", () => {
    vi.useFakeTimers();
    render(<TestimonialCarousel />);
    expect(screen.getByText(/Felipe Sasaki/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(screen.getByText(/Lucas Lopes de Souza Guilha/)).toBeInTheDocument();
  });
});
