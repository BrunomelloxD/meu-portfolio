import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/services/access-log.service", () => ({
  logPortalAccess: vi.fn().mockResolvedValue(undefined),
}));

import { logPortalAccess } from "@/lib/services/access-log.service";

function mockRequest(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/log-access", {
    method: "POST",
    headers: new Headers(headers),
  });
}

describe("POST /api/log-access", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.mocked(logPortalAccess).mockClear();
  });

  it("should extract IP from x-forwarded-for using the first value", async () => {
    const req = mockRequest({
      "x-forwarded-for": "203.0.113.10, 70.41.3.18",
      "user-agent": "vitest",
    });

    const res = await POST(req as unknown as import("next/server").NextRequest);
    const body = await res.json();

    expect(body).toEqual({ success: true });
    expect(logPortalAccess).toHaveBeenCalledWith({
      ipAddress: "203.0.113.10",
      userAgent: "vitest",
    });
  });

  it("should fallback to x-real-ip when x-forwarded-for is missing", async () => {
    const req = mockRequest({
      "x-real-ip": "198.51.100.5",
      "user-agent": "vitest",
    });

    await POST(req as unknown as import("next/server").NextRequest);

    expect(logPortalAccess).toHaveBeenCalledWith({
      ipAddress: "198.51.100.5",
      userAgent: "vitest",
    });
  });

  it("should resolve public IP via ipify when client IP is loopback", async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ ip: "200.100.50.25" }),
    });

    const req = mockRequest({
      "x-forwarded-for": "::1",
      "user-agent": "vitest",
    });

    await POST(req as unknown as import("next/server").NextRequest);

    expect(fetchMock).toHaveBeenCalledWith("https://api.ipify.org?format=json");
    expect(logPortalAccess).toHaveBeenCalledWith({
      ipAddress: "200.100.50.25",
      userAgent: "vitest",
    });
  });

  it("should fallback to 'localhost' when ipify call fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network"));

    const req = mockRequest({
      "x-forwarded-for": "127.0.0.1",
      "user-agent": "vitest",
    });

    await POST(req as unknown as import("next/server").NextRequest);

    expect(logPortalAccess).toHaveBeenCalledWith({
      ipAddress: "localhost",
      userAgent: "vitest",
    });
  });

  it("should default user-agent to 'unknown' when header is missing", async () => {
    const req = mockRequest({ "x-forwarded-for": "203.0.113.1" });

    await POST(req as unknown as import("next/server").NextRequest);

    expect(logPortalAccess).toHaveBeenCalledWith({
      ipAddress: "203.0.113.1",
      userAgent: "unknown",
    });
  });

  it("should return 500 when logPortalAccess throws", async () => {
    vi.mocked(logPortalAccess).mockRejectedValueOnce(new Error("boom"));

    const req = mockRequest({
      "x-forwarded-for": "203.0.113.1",
      "user-agent": "vitest",
    });

    const res = await POST(req as unknown as import("next/server").NextRequest);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ success: false, error: "Internal Server Error" });
  });
});
