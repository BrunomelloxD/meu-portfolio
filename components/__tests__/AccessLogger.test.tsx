import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AccessLogger } from "../AccessLogger";

describe("<AccessLogger />", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should render nothing", () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const { container } = render(<AccessLogger />);
    expect(container.firstChild).toBeNull();
  });

  it("should call /api/log-access exactly once on mount", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    render(<AccessLogger />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/log-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("should not call the api twice when re-rendered", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const { rerender } = render(<AccessLogger />);
    rerender(<AccessLogger />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  it("should swallow fetch errors and log them", async () => {
    const errorSpy = vi.spyOn(console, "error");
    fetchMock.mockRejectedValueOnce(new Error("network"));

    render(<AccessLogger />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Erro ao registrar acesso:", expect.any(Error));
    });
  });
});
