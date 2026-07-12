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
export interface HeaderCheckDetail {
  name: string;
  present: boolean;
  value: string | null;
  score: number;
  recommendation: string;
}

export interface ScanResponse {
  url: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  scannedAt: string;
  checks: {
    hsts: HeaderCheckDetail;
    csp: HeaderCheckDetail;
    xFrameOptions: HeaderCheckDetail;
    xContentTypeOptions: HeaderCheckDetail;
    referrerPolicy: HeaderCheckDetail;
    serverInfo: HeaderCheckDetail;
  };
}
