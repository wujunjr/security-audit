import { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Play } from "lucide-react";
import type { ScanResponse } from "@shipaudit/contracts";

export function InteractiveScanner() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    "Initiating security connection...",
    "Analyzing DNS records...",
    "Querying HTTP response headers...",
    "Evaluating security parameters...",
    "Analyzing Content-Security-Policy...",
    "Inspecting server signatures...",
    "Calculating configuration score..."
  ];

  useEffect(() => {
    let intervalId: any;
    if (loading) {
      let stageIdx = 0;
      setLoadingStage(stages[0]);
      intervalId = setInterval(() => {
        stageIdx = (stageIdx + 1) % stages.length;
        setLoadingStage(stages[stageIdx]);
      }, 700);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setScanResult(null);
    setError(null);

    // Formulate API endpoint
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const envApiUrl = import.meta.env.PUBLIC_API_URL;
    let apiBase = "";
    
    if (envApiUrl) {
      apiBase = envApiUrl.replace(/\/$/, "");
    } else if (isLocal) {
      apiBase = "http://127.0.0.1:8787";
    }
    
    const scanUrl = `${apiBase}/api/scan?url=${encodeURIComponent(urlInput.trim())}`;

    try {
      const response = await fetch(scanUrl);
      const contentType = response.headers.get("content-type") || "";
      
      if (!contentType.includes("application/json")) {
        throw new Error(
          "Invalid API response (not JSON). The Worker API routing is not configured yet. " +
          "Please deploy the Worker and map it to '/api/*' in your Cloudflare dashboard under Workers Routes, " +
          "or set the PUBLIC_API_URL environment variable to your Worker URL during the Pages build."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Scan failed with status ${response.status}`);
      }

      setScanResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during scan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6 md:p-8 w-full mt-8 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br from-[var(--accent-dim)] to-[var(--cyan-dim)] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <h3 className="m-0 text-xl font-bold tracking-tight">Observable Security Headers Scan</h3>
        <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
          Passive real-time check of HSTS, CSP, CORS frame options, and server disclosures.
        </p>
      </div>

      <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            required
            type="text"
            placeholder="enter-your-domain.com"
            className="input-field w-full pl-4 pr-10"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !urlInput.trim()}
          className="btn-primary !h-12 shrink-0 justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Run Quick Scan</span>
            </>
          )}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 py-6 text-center border border-dashed border-[var(--line)] bg-[var(--bg-deep)] rounded-xl">
          <Loader2 className="animate-spin text-[var(--accent)] mx-auto mb-3" size={28} />
          <p className="text-sm font-semibold tracking-wide text-[var(--ink)] m-0">{loadingStage}</p>
          <p className="text-xs text-[var(--ink-faint)] mt-1">Checking target HTTP security metadata...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 rounded-xl border border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.05)] flex gap-3 items-start">
          <ShieldAlert className="text-[var(--red)] shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-bold text-[var(--red)] m-0">Scan Failed</h4>
            <p className="text-xs text-[var(--ink-muted)] mt-1 mb-0 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Scan Results Dashboard */}
      {scanResult && (
        <div className="mt-8 border border-[var(--line)] bg-[var(--bg-deep)] rounded-xl p-5 md:p-6 fade-in-up">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] items-center border-b border-[var(--line)] pb-5 mb-5">
            <div>
              <h4 className="text-sm font-extrabold text-[var(--ink-faint)] uppercase tracking-wider m-0">Scan Target</h4>
              <p className="text-lg font-bold text-[var(--ink)] mt-1 mb-0 truncate max-w-lg">{scanResult.url}</p>
              <p className="text-xs text-[var(--ink-faint)] mt-1 m-0">Scanned on {new Date(scanResult.scannedAt).toLocaleTimeString()}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-xs font-bold text-[var(--ink-muted)]">Hygiene Score</span>
                <span className="block text-2xl font-black gradient-text mt-0.5">{scanResult.score} / 100</span>
              </div>
              <div className="flex items-center justify-center size-14 rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] text-3xl font-black">
                {scanResult.grade === "A" && <span className="text-[var(--emerald)]">A</span>}
                {scanResult.grade === "B" && <span className="text-[var(--blue)]">B</span>}
                {scanResult.grade === "C" && <span className="text-[var(--amber)]">C</span>}
                {scanResult.grade === "D" && <span className="text-[var(--red)]">D</span>}
                {scanResult.grade === "F" && <span className="text-[var(--red)]">F</span>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-[var(--ink-faint)] uppercase tracking-wider mb-3">Checks Performed</h5>

            {/* Check Cards */}
            {Object.entries(scanResult.checks).map(([key, check]) => {
              const Icon = check.present ? ShieldCheck : check.score === 0 && key === "serverInfo" ? AlertTriangle : ShieldAlert;
              const colorClass = check.present ? "text-[var(--emerald)]" : check.score === 0 && key === "serverInfo" ? "text-[var(--amber)]" : "text-[var(--red)]";
              const borderClass = check.present ? "border-[rgba(52,211,153,0.15)]" : check.score === 0 && key === "serverInfo" ? "border-[rgba(251,191,36,0.15)]" : "border-[rgba(248,113,113,0.15)]";

              return (
                <div key={key} className={`border ${borderClass} rounded-lg p-3 bg-[var(--bg-surface)]/40 flex items-start gap-3`}>
                  <Icon className={`${colorClass} shrink-0 mt-0.5`} size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-bold text-[var(--ink)] truncate">{check.name}</span>
                      <span className={`text-xs font-extrabold ${colorClass}`}>
                        {check.present ? `+${check.score}` : `0`} pts
                      </span>
                    </div>
                    {check.value && (
                      <p className="text-xs font-mono bg-[var(--bg-deep)] border border-[var(--line)] rounded px-1.5 py-0.5 text-[var(--ink-muted)] mt-1.5 inline-block truncate max-w-full">
                        {check.value}
                      </p>
                    )}
                    <p className="text-xs text-[var(--ink-muted)] mt-1 mb-0 leading-relaxed">{check.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="divider my-5"></div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-surface)]/80">
            <div className="text-sm text-[var(--ink-muted)] text-center sm:text-left leading-relaxed">
              <span className="font-bold text-[var(--ink)] block">Need a deeper audit?</span>
              Cookie scopes, session settings, Supabase RLS, and logic configurations can't be scanned passively.
            </div>
            <a href="#founding-review" className="btn-primary !h-10 !text-xs shrink-0">Get Founding Review</a>
          </div>
        </div>
      )}
    </div>
  );
}
