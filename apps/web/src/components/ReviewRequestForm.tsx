import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard } from "lucide-react";

const securityEmail = "security@laws3.net";

type Props = {
  /** True when PUBLIC_FOUNDING_REVIEW_PAYMENT_URL is set at build time */
  paymentConfigured?: boolean;
  /** Optional override for tests */
  paymentUrl?: string;
};

export function ReviewRequestForm({
  paymentConfigured = false,
  paymentUrl = "",
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    appUrl: "",
    stack: "",
    launchDate: "",
    context: "",
    agreeScope: false,
  });

  const resolvedPaymentUrl =
    paymentUrl ||
    (typeof import.meta.env.PUBLIC_FOUNDING_REVIEW_PAYMENT_URL === "string"
      ? import.meta.env.PUBLIC_FOUNDING_REVIEW_PAYMENT_URL
      : "");

  const canCheckout =
    paymentConfigured &&
    typeof resolvedPaymentUrl === "string" &&
    resolvedPaymentUrl.startsWith("https://");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      `ShipAudit founding review inquiry: ${form.appUrl || "new app"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `App URL: ${form.appUrl}`,
        `Stack: ${form.stack}`,
        `Target launch date: ${form.launchDate || "Not set"}`,
        "",
        "Context / top worries:",
        form.context || "No additional context.",
        "",
        "I understand this is a scoped public-surface expert review, not a penetration test or certification.",
      ].join("\n"),
    );
    return `mailto:${securityEmail}?subject=${subject}&body=${body}`;
  }, [form]);

  function persistOrderDraft() {
    try {
      const draft = {
        ...form,
        createdAt: new Date().toISOString(),
        status: canCheckout ? "redirecting-to-payment" : "inquiry-only",
      };
      sessionStorage.setItem("shipaudit_founding_draft", JSON.stringify(draft));
    } catch {
      /* ignore private mode */
    }
  }

  function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    if (!form.agreeScope) {
      return;
    }
    persistOrderDraft();
    setSubmitted(true);

    if (canCheckout) {
      const returnHint = encodeURIComponent(form.email);
      const url = new URL(resolvedPaymentUrl);
      // Merchants often ignore unknown query params; keep email for operator correlation when supported.
      if (!url.searchParams.has("client_reference_id")) {
        url.searchParams.set("client_reference_id", returnHint.slice(0, 200));
      }
      window.location.href = url.toString();
      return;
    }

    window.location.href = mailto;
  }

  if (submitted) {
    return (
      <div className="glass-card p-6 md:p-8">
        <CheckCircle2 className="mb-3 text-[var(--emerald)]" aria-hidden="true" size={28} />
        <h3 className="m-0 text-xl font-bold">
          {canCheckout ? "Continue to payment" : "Your inquiry draft is ready"}
        </h3>
        <p className="mb-4 text-[var(--ink-muted)]">
          {canCheckout
            ? "If checkout did not open, use the button below. After payment you will land on the success page — keep your receipt."
            : "Checkout is not configured on this deployment yet. Send the email so we can share a payment link manually. Mailto alone is not proof of purchase."}
        </p>
        {canCheckout ? (
          <a
            className="btn-primary"
            href={resolvedPaymentUrl}
          >
            <CreditCard size={18} aria-hidden="true" />
            Open payment link
          </a>
        ) : (
          <a className="btn-ghost !px-0" href={mailto}>
            Open the email again →
          </a>
        )}
        <p className="mt-4 mb-0 text-sm text-[var(--ink-faint)]">
          After paying, open{" "}
          <a className="font-semibold text-[var(--accent)] hover:text-[var(--cyan)]" href="/payment-success">
            /payment-success
          </a>{" "}
          and email your receipt to {securityEmail}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="glass-card grid gap-5 p-6 md:p-8"
      id="review-request"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-cyan">Founding Expert Review</span>
          <span className="badge badge-accent">$99</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold">Tell us what you are shipping</h2>
        <p className="m-0 text-sm text-[var(--ink-muted)]">
          {canCheckout
            ? "Submit to continue to checkout. We confirm scope before analysis starts."
            : "Payment link not set on this build — submit opens a pre-sales email. We will send a real checkout link separately."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-bold">
          Name
          <input
            required
            className="input-field"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Email
          <input
            required
            type="email"
            className="input-field"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          App URL
          <input
            required
            type="url"
            placeholder="https://your-app.com"
            className="input-field"
            value={form.appUrl}
            onChange={(event) => setForm({ ...form, appUrl: event.target.value })}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Stack
          <input
            required
            placeholder="Lovable + Supabase + Vercel"
            className="input-field"
            value={form.stack}
            onChange={(event) => setForm({ ...form, stack: event.target.value })}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold md:col-span-2">
          Target launch date
          <input
            type="date"
            className="input-field"
            value={form.launchDate}
            onChange={(event) =>
              setForm({ ...form, launchDate: event.target.value })
            }
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold md:col-span-2">
          What worries you most?
          <textarea
            rows={4}
            className="textarea-field"
            placeholder="Auth, exposed keys, Supabase RLS, AI endpoint cost..."
            value={form.context}
            onChange={(event) => setForm({ ...form, context: event.target.value })}
          />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-[var(--ink-muted)] cursor-pointer">
        <input
          required
          type="checkbox"
          className="mt-1 accent-[var(--accent)]"
          checked={form.agreeScope}
          onChange={(event) =>
            setForm({ ...form, agreeScope: event.target.checked })
          }
        />
        <span>
          I confirm this is a scoped public-surface expert review (not a pentest or
          certification), and I will only provide read-only materials — no passwords,
          cookies, or production secrets.
        </span>
      </label>
      <button
        type="submit"
        className="btn-primary w-full justify-center"
      >
        {canCheckout ? "Continue to Payment" : "Request Payment Link by Email"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
