import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sword } from "lucide-react";
import { EquipmentSlot } from "../equipment-slot";

describe("<EquipmentSlot />", () => {
  it("renders the given icon with the label exposed as its accessible name", () => {
    render(<EquipmentSlot icon={Sword} label="React" />);
    expect(screen.getByRole("img", { name: "React" })).toBeInTheDocument();
  });

  it("defaults to unhighlighted, without the brighter gold ring class", () => {
    render(<EquipmentSlot icon={Sword} label="React" />);
    expect(screen.getByRole("img", { name: "React" })).not.toHaveClass("ring-er-gold-bright");
  });

  it("applies the brighter gold ring class when highlighted", () => {
    render(<EquipmentSlot icon={Sword} label="React" highlighted />);
    expect(screen.getByRole("img", { name: "React" })).toHaveClass("ring-er-gold-bright");
  });
});
