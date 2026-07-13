import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("GET /api/health", () => {
  it("returns the service contract", async () => {
    const response = await app.request("http://localhost/api/health");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      service: "shipaudit-worker",
      version: "0.1.0",
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns a structured 404", async () => {
    const response = await app.request("http://localhost/missing");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "NOT_FOUND" },
    });
  });
});

describe("GET /", () => {
  it("returns the root welcome response", async () => {
    const response = await app.request("http://localhost/");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      name: "ShipAudit API",
      status: "operational",
    });
  });
});

