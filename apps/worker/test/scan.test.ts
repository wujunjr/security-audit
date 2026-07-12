import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { app } from "../src/app";

describe("GET /api/scan", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns 400 when url parameter is missing", async () => {
    const response = await app.request("http://localhost/api/scan");
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      error: { code: "BAD_REQUEST" },
    });
  });

  it("returns 400 for an invalid URL structure", async () => {
    const response = await app.request("http://localhost/api/scan?url=example.com:abc");
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({
      error: { code: "INVALID_URL" },
    });
  });

  it("returns 403 for private/local hostnames", async () => {
    const response = await app.request("http://localhost/api/scan?url=localhost");
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body).toMatchObject({
      error: { code: "FORBIDDEN_HOST" },
    });
  });

  it("successfully parses headers from a mock response", async () => {
    // Mock global fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      headers: new Headers({
        "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
        "content-security-policy": "default-src 'self'",
        "x-frame-options": "DENY",
        "x-content-type-options": "nosniff",
        "referrer-policy": "no-referrer",
        "server": "nginx",
      }),
    } as Response);

    const response = await app.request("http://localhost/api/scan?url=example.com");
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.score).toBe(90); // 20 (HSTS) + 20 (CSP) + 20 (XFO) + 15 (XCTO) + 15 (Ref) + 0 (nginx is disclosing)
    expect(body.grade).toBe("A");
    expect(body.checks.hsts.present).toBe(true);
    expect(body.checks.csp.present).toBe(true);
    expect(body.checks.xFrameOptions.present).toBe(true);
    expect(body.checks.serverInfo.present).toBe(false); // Disclosing Server header info
  });
});
