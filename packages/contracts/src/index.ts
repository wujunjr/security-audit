export interface HealthResponse {
  ok: true;
  service: "shipaudit-worker";
  version: string;
  timestamp: string;
}

export type ReviewTier = "founding" | "standard" | "code-review";

export interface ReviewRequest {
  name: string;
  email: string;
  appUrl: string;
  stack: string;
  launchDate?: string;
  tier: ReviewTier;
  context?: string;
}

