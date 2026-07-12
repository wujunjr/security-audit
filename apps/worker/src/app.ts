import type { HealthResponse, ScanResponse, HeaderCheckDetail } from "@shipaudit/contracts";
import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

// Enable CORS for API requests
app.use("/api/*", cors({
  origin: "*",
  allowMethods: ["GET", "OPTIONS"],
  allowHeaders: ["Content-Type"],
  maxAge: 600,
}));

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

app.get("/api/scan", async (context) => {
  const targetUrlStr = context.req.query("url");
  if (!targetUrlStr) {
    return context.json({ error: { code: "BAD_REQUEST", message: "Missing 'url' parameter." } }, 400);
  }

  let url: URL;
  try {
    let normalized = targetUrlStr.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }
    url = new URL(normalized);
  } catch (err) {
    return context.json({ error: { code: "INVALID_URL", message: "Provided URL is invalid." } }, 400);
  }

  // Prevent local scans / SSRF checks
  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return context.json({ error: { code: "FORBIDDEN_HOST", message: "Scanning local or private hosts is forbidden." } }, 403);
  }

  try {
    // Perform passive GET request with timeout and redirection limits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const targetRes = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ShipAuditScanner/0.1; +https://www.laws3.net)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    
    clearTimeout(timeoutId);

    const headers = targetRes.headers;

    // Check HSTS
    const hstsVal = headers.get("strict-transport-security");
    const hsts: HeaderCheckDetail = {
      name: "Strict-Transport-Security (HSTS)",
      present: !!hstsVal,
      value: hstsVal,
      score: hstsVal ? 20 : 0,
      recommendation: hstsVal
        ? "Excellent! HSTS is enabled, forcing clients to connect over HTTPS."
        : "Critical: Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' response header to enforce HTTPS connection.",
    };

    // Check CSP
    const cspVal = headers.get("content-security-policy");
    const csp: HeaderCheckDetail = {
      name: "Content-Security-Policy (CSP)",
      present: !!cspVal,
      value: cspVal,
      score: cspVal ? 20 : 0,
      recommendation: cspVal
        ? "Good! CSP is configured to restrict resource loading."
        : "Highly Recommended: Add Content-Security-Policy header to protect your site against Cross-Site Scripting (XSS) and data injection attacks.",
    };

    // Check X-Frame-Options
    const xfoVal = headers.get("x-frame-options");
    const xFrameOptions: HeaderCheckDetail = {
      name: "X-Frame-Options",
      present: !!xfoVal,
      value: xfoVal,
      score: xfoVal ? 20 : 0,
      recommendation: xfoVal
        ? "Good! Clickjacking protection is configured."
        : "Recommended: Add 'X-Frame-Options: DENY' or 'SAMEORIGIN' header to prevent malicious iframe framing (Clickjacking).",
    };

    // Check X-Content-Type-Options
    const xctoVal = headers.get("x-content-type-options");
    const xContentTypeOptions: HeaderCheckDetail = {
      name: "X-Content-Type-Options",
      present: !!xctoVal && xctoVal.toLowerCase().includes("nosniff"),
      value: xctoVal,
      score: xctoVal && xctoVal.toLowerCase().includes("nosniff") ? 15 : 0,
      recommendation: xctoVal && xctoVal.toLowerCase().includes("nosniff")
        ? "Good! MIME sniffing protection is active."
        : "Recommended: Add 'X-Content-Type-Options: nosniff' response header to protect against MIME type sniffing exploits.",
    };

    // Check Referrer-Policy
    const refVal = headers.get("referrer-policy");
    const referrerPolicy: HeaderCheckDetail = {
      name: "Referrer-Policy",
      present: !!refVal,
      value: refVal,
      score: refVal ? 15 : 0,
      recommendation: refVal
        ? "Good! Referrer leakage policy is configured."
        : "Recommended: Add 'Referrer-Policy: strict-origin-when-cross-origin' to restrict what referral information is shared with other sites.",
    };

    // Check Server disclosure
    const serverVal = headers.get("server") || headers.get("x-powered-by");
    const isDisclosing = !!serverVal && !["cloudflare", "vercel", "netlify"].includes(serverVal.toLowerCase());
    const serverInfo: HeaderCheckDetail = {
      name: "Server Signature Exposure",
      present: !isDisclosing,
      value: serverVal,
      score: isDisclosing ? 0 : 10,
      recommendation: isDisclosing
        ? `Warning: Your server leaks signature info ('${serverVal}'). Remove Server or X-Powered-By headers to hide software details from attackers.`
        : "Perfect! No sensitive server software details are disclosed.",
    };

    const totalScore = hsts.score + csp.score + xFrameOptions.score + xContentTypeOptions.score + referrerPolicy.score + serverInfo.score;

    let grade: "A" | "B" | "C" | "D" | "F";
    if (totalScore >= 90) grade = "A";
    else if (totalScore >= 70) grade = "B";
    else if (totalScore >= 50) grade = "C";
    else if (totalScore >= 30) grade = "D";
    else grade = "F";

    const scanRes: ScanResponse = {
      url: url.toString(),
      score: totalScore,
      grade,
      scannedAt: new Date().toISOString(),
      checks: {
        hsts,
        csp,
        xFrameOptions,
        xContentTypeOptions,
        referrerPolicy,
        serverInfo,
      },
    };

    return context.json(scanRes, 200, {
      "Cache-Control": "public, max-age=60",
    });

  } catch (err: any) {
    return context.json({
      error: {
        code: "SCAN_FAILED",
        message: err.name === "AbortError" ? "Request timed out after 4 seconds." : `Failed to request the target URL: ${err.message}`,
      },
    }, 502);
  }
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
