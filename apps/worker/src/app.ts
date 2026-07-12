import type { HealthResponse } from "@shipaudit/contracts";
import { Hono } from "hono";

export const app = new Hono();

app.get("/api/health", (context) => {
  const response: HealthResponse = {
    ok: true,
    service: "shipaudit-worker",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  };

  return context.json(response, 200, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
});

app.notFound((context) =>
  context.json(
    {
      error: {
        code: "NOT_FOUND",
        message: "The requested endpoint does not exist.",
      },
    },
    404,
  ),
);

