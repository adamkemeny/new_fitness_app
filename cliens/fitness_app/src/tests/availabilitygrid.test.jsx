import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AvailabilityGrid from "../AvailabilityGrid";

describe("Edzésidőpont-választó", () => {
  it("Nem jelenik meg, ha zárva van", () => {
    render(
      <AvailabilityGrid
        isOpen={false}
        onClose={vi.fn()}
        value={{}}
        onChange={vi.fn()}
      />
    );

    expect(
      screen.queryByText("Mikor érsz rá edzeni?")
    ).not.toBeInTheDocument();
  });

  it("Megjeleníti az időpontválasztót", () => {
    render(
      <AvailabilityGrid
        isOpen={true}
        onClose={vi.fn()}
        value={{}}
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByText("Mikor érsz rá edzeni?")
    ).toBeInTheDocument();
  });

  it("Kiválasztott időpontot ad át", () => {
    const onChange = vi.fn();

    render(
      <AvailabilityGrid
        isOpen={true}
        onClose={vi.fn()}
        value={{ Hétfő: [] }}
        onChange={onChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hétfő 8:00"
      })
    );

    expect(onChange).toHaveBeenCalledWith({
      Hétfő: [8]
    });
  });

  it("A kiválasztott időpontot el lehet távolítani", () => {
    const onChange = vi.fn();

    render(
      <AvailabilityGrid
        isOpen={true}
        onClose={vi.fn()}
        value={{ Hétfő: [8] }}
        onChange={onChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Hétfő 8:00"
      })
    );

    expect(onChange).toHaveBeenCalledWith({
      Hétfő: []
    });
  });
});