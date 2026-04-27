import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logPortalAccess } from "../access-log.service";

describe("logPortalAccess", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should call the API with ipAddress and userAgent as query params", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });

    await logPortalAccess({ ipAddress: "1.2.3.4", userAgent: "vitest-agent" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/portal-access-log?");
    expect(url).toContain("ipAddress=1.2.3.4");
    expect(url).toContain("userAgent=vitest-agent");
    expect(options).toMatchObject({
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("should encode special characters in query params", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });

    await logPortalAccess({
      ipAddress: "::1",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("ipAddress=%3A%3A1");
    expect(url).toContain("userAgent=Mozilla%2F5.0+%28X11%3B+Linux+x86_64%29");
  });

  it("should warn but not throw when the response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    const warnSpy = vi.spyOn(console, "warn");

    await expect(
      logPortalAccess({ ipAddress: "1.1.1.1", userAgent: "agent" }),
    ).resolves.toBeUndefined();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("500"));
  });

  it("should swallow network errors and log to console.error", async () => {
    const error = new Error("network down");
    fetchMock.mockRejectedValueOnce(error);
    const errorSpy = vi.spyOn(console, "error");

    await expect(
      logPortalAccess({ ipAddress: "1.1.1.1", userAgent: "agent" }),
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith(expect.any(String), error);
  });
});
