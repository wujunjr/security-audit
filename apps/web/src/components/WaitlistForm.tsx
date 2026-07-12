import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const securityEmail = "security@laws3.net";

export function WaitlistForm() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent("ShipAudit auto-scan waitlist");
    const body = encodeURIComponent(
      [
        `Email: ${email}`,
        `Domain of interest: ${domain || "n/a"}`,
        "",
        "Please add me to the automatic public scan waitlist.",
        "I understand this is not a live scan and there is no ship date.",
      ].join("\n"),
    );
    return `mailto:${securityEmail}?subject=${subject}&body=${body}`;
  }, [email, domain]);

  function submit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setDone(true);
    window.location.href = mailto;
  }

  if (done) {
    return (
      <div className="glass-card p-6 md:p-8">
        <CheckCircle2 className="mb-3 text-[var(--emerald)]" aria-hidden="true" size={28} />
        <h2 className="m-0 text-xl font-bold">Email draft ready</h2>
        <p className="mb-0 text-[var(--ink-muted)]">
          Send it to join the waitlist. This still does not run a scan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card grid gap-5 p-6 md:p-8">
      <label className="grid gap-1.5 text-sm font-bold">
        Email
        <input
          required
          type="email"
          className="input-field"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-bold">
        Domain of interest (optional)
        <input
          className="input-field"
          placeholder="example.com"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
        />
      </label>
      <button
        type="submit"
        className="btn-primary w-full justify-center"
      >
        Join Waitlist by Email
      </button>
    </form>
  );
}
