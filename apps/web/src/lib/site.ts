/**
 * Site-wide constants for ShipAudit phase -1 (commercial validation).
 * Keep in sync with docs/website-security-checkup-master-spec.md §12.
 */

export const site = {
  name: "ShipAudit",
  productHost: "security.laws3.net",
  /** Customer-facing contact */
  securityEmail: "security@laws3.net",
  /** Infrastructure accounts only — do not show as customer contact */
  adminEmail: "admin@laws3.net",
  /** Public homepage URL used in User-Agent later; also brand link */
  publicUrl: "https://security.laws3.net",
  methodologyVersion: "0.1-validation",
  foundingPriceUsd: 99,
  foundingSlotsTotal: 10,
  foundingSlaBusinessDays: 3,
  foundingMaxMinutes: 90,
  /** Required honesty strings (spec §3) */
  requiredDisclaimer:
    "ShipAudit measures observable HTTP security hygiene within the stated scope. It is not a vulnerability scan, penetration test, compliance assessment, or security certification.",
  scoreSubtitle:
    "Configuration hygiene score — not proof that the application is secure.",
  reviewerLine:
    "Reviewed by John W. — 20+ years in IT, including 10+ years in cybersecurity",
} as const;

/**
 * Payment URL for Founding Expert Review.
 * Set PUBLIC_FOUNDING_REVIEW_PAYMENT_URL at build/deploy time (Creem or Stripe Payment Link).
 * Empty means payment is not yet configured — UI must not claim checkout is live.
 */
export function getFoundingPaymentUrl(): string {
  const value = import.meta.env.PUBLIC_FOUNDING_REVIEW_PAYMENT_URL;
  if (typeof value === "string" && value.startsWith("https://")) {
    return value;
  }
  return "";
}

export function isPaymentConfigured(): boolean {
  return getFoundingPaymentUrl().length > 0;
}
