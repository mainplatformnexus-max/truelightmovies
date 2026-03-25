import { useState, useRef, useEffect } from "react";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = "https://function-bun-production-ac72.up.railway.app";

const PLANS = [
  { id: "day",   label: "1 Day",   price: 2000,  original: 3000,  discount: 33, days: 1  },
  { id: "week",  label: "1 Week",  price: 5000,  original: 8000,  discount: 38, days: 7  },
  { id: "month", label: "1 Month", price: 20000, original: 30000, discount: 33, days: 30 },
];
const fmt = (n: number) => `UGX ${n.toLocaleString()}`;

const BENEFITS = [
  { icon: "🎬", title: "Members Access",  desc: "VIP exclusive content/episodes" },
  { icon: "📱", title: "Multi-Device",    desc: "Phone, PC, and TV"              },
  { icon: "🎯", title: "High Resolution", desc: "Watch 1080P videos"             },
  { icon: "⚡", title: "Early Access",    desc: "New episodes first"             },
  { icon: "⬇️", title: "Fast Download",  desc: "Up to 5 videos at once"         },
  { icon: "🚫", title: "Ad Free",         desc: "Clean ad-free experience"       },
];

type Step = "plans" | "checkout" | "success";
type PayStatus = "idle" | "initiating" | "pending" | "failed";

function formatMsisdn(raw: string): string {
  const cleaned = raw.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+256")) return cleaned;
  if (cleaned.startsWith("256")) return "+" + cleaned;
  if (cleaned.startsWith("0")) return "+256" + cleaned.slice(1);
  return "+256" + cleaned;
}

async function activateSubscription(
  uid: string,
  planId: string,
  planLabel: string,
  days: number,
  phone: string,
  planPrice: number,
  msisdn: string
) {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  const expiryStr = expiry.toISOString().split("T")[0];

  await updateDoc(doc(db, "userProfiles", uid), {
    plan: planLabel,
    planExpiry: expiryStr,
    status: "active",
    phone,
  });

  await addDoc(collection(db, "subscriptions"), {
    uid,
    plan: planId,
    planLabel,
    days,
    phone,
    amount: planPrice,
    activatedAt: serverTimestamp(),
    expiresAt: expiryStr,
    status: "active",
  });

  const vjEarnings = Math.floor(planPrice * 0.6);
  await addDoc(collection(db, "transactions"), {
    type: "subscription",
    amount: vjEarnings,
    description: `Subscription: ${planLabel} (${msisdn})`,
    date: new Date().toISOString().split("T")[0],
    status: "completed",
    phone: msisdn,
    uid,
    createdAt: serverTimestamp(),
  });
}

export function SubscribeModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const { profile, refreshProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [step, setStep] = useState<Step>("plans");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payStatus, setPayStatus] = useState<PayStatus>("idle");

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const payStatusRef = useRef<PayStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDoneRef = useRef(false);

  const updatePayStatus = (s: PayStatus) => {
    payStatusRef.current = s;
    setPayStatus(s);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const plan = PLANS[selectedPlan];
  const saved = plan.original - plan.price;
  const loggedInUser = profile?.displayName || null;

  const handleSubscribe = async () => {
    if (!profile) { setError("Please log in first to subscribe."); return; }
    const cleaned = phone.replace(/\s+/g, "");
    if (!cleaned || cleaned.length < 9) { setError("Enter a valid phone number."); return; }

    const msisdn = formatMsisdn(cleaned);
    setError("");
    setLoading(true);
    isDoneRef.current = false;
    updatePayStatus("initiating");

    try {
      const depositRes = await fetch(`${API_BASE}/api/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn,
          amount: plan.price,
          description: `MovieBox ${plan.label} Subscription`,
        }),
      });
      const depositData = await depositRes.json();
      console.log("Deposit response:", depositData);

      const internalRef = depositData.internal_reference ?? depositData.data?.internal_reference;

      if (!depositData.success || !internalRef) {
        setError(depositData.message || depositData.error || "Failed to initiate payment. Please try again.");
        updatePayStatus("failed");
        setLoading(false);
        return;
      }

      updatePayStatus("pending");

      const poll = async () => {
        if (isDoneRef.current) return;
        try {
          const statusRes = await fetch(`${API_BASE}/api/request-status?internal_reference=${encodeURIComponent(internalRef)}`);
          const statusData = await statusRes.json();
          console.log("Payment status:", statusData);

          if (isDoneRef.current) return;
          const d = statusData.data ?? statusData;

          if (d.request_status === "success" || (d.success === true && d.status === "success")) {
            isDoneRef.current = true;
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            try {
              await activateSubscription(profile.uid, plan.id, plan.label, plan.days, cleaned, plan.price, msisdn);
              await refreshProfile();
              updatePayStatus("idle");
              setStep("success");
            } catch {
              setError("Payment received but activation failed. Contact support.");
              updatePayStatus("failed");
            }
            setLoading(false);
          } else if (
            d.request_status === "failed" ||
            d.status === "failed" ||
            d.request_status === "cancelled" ||
            d.status === "cancelled"
          ) {
            isDoneRef.current = true;
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setError(d.message || "Payment was declined or failed. Please try again.");
            updatePayStatus("failed");
            setLoading(false);
          }
        } catch {
          // network hiccup, keep polling
        }
      };

      poll();
      pollingRef.current = setInterval(poll, 1000);

      timeoutRef.current = setTimeout(() => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        if (payStatusRef.current === "pending") {
          setError("Payment confirmation timed out. Check your phone and try again.");
          updatePayStatus("failed");
          setLoading(false);
        }
      }, 5 * 60 * 1000);

    } catch {
      setError("Network error. Please check your connection and try again.");
      updatePayStatus("failed");
      setLoading(false);
    }
  };

  const resetPayment = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePayStatus("idle");
    setError("");
    setLoading(false);
  };

  const buttonLabel = () => {
    if (payStatus === "initiating") return "Initiating payment…";
    if (payStatus === "pending") return "Waiting for confirmation…";
    return `Pay ${fmt(plan.price)} & Subscribe`;
  };

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-end justify-center"
        style={{ background: "rgba(0,0,0,0.8)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full rounded-t-2xl overflow-hidden" style={{ background: "#13151a" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-2.5 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2">
              {step !== "plans" && step !== "success" && payStatus !== "pending" && (
                <button onClick={() => { resetPayment(); setStep("plans"); }} className="text-white/40 hover:text-white mr-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}
              <span className="text-white font-bold text-xs">
                {step === "success" ? "🎉 Subscribed!" : "VIP Subscription"}
              </span>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors p-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="px-3 pt-2.5 pb-4">

            {/* Success */}
            {step === "success" && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-white font-bold text-base mb-1">Access Activated!</p>
                <p className="text-white/50 text-xs mb-1">Your <span className="text-purple-400 font-semibold">{plan.label}</span> subscription is now active.</p>
                <p className="text-white/30 text-[10px] mb-4">Enjoy all premium content until your plan expires.</p>
                <button onClick={onClose} className="w-full h-10 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Start Watching</button>
              </div>
            )}

            {/* Plan selection */}
            {step === "plans" && (
              <>
                <div className="flex gap-1.5 mb-2">
                  {PLANS.map((p, i) => (
                    <button key={p.id} onClick={() => setSelectedPlan(i)}
                      className="relative flex-1 rounded-lg py-2 px-1 text-center transition-all border"
                      style={{ background: i === selectedPlan ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)", borderColor: i === selectedPlan ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.08)" }}
                    >
                      {p.discount > 0 && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-white text-[8px] font-bold px-1 py-px rounded-full whitespace-nowrap" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>{p.discount}% off</div>}
                      <div className="text-white/60 text-[9px] mt-0.5 leading-tight">{p.label}</div>
                      <div className="text-sm font-bold leading-tight" style={{ color: i === selectedPlan ? "#a855f7" : "white" }}>UGX {p.price.toLocaleString()}</div>
                      <div className="text-white/30 text-[9px] line-through">UGX {p.original.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
                <p className="text-white/40 text-[10px] mb-2">· New subscribers get {plan.discount}% off the first term!</p>
                <div className="flex items-center justify-between mb-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div>
                    <div className="text-white/50 text-[10px]">You pay</div>
                    <div className="text-white text-base font-bold leading-tight">{fmt(plan.price)}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-[10px]">Pay via</div>
                    <img src="https://pbs.twimg.com/media/Ggq-h4CXEAAv6wk.jpg" alt="Mobile Money" className="h-6 rounded mt-0.5 object-cover" style={{ maxWidth: 70 }} />
                  </div>
                  <div className="text-white text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save {fmt(saved)}</div>
                </div>
                <div className="grid grid-cols-3 gap-1 mb-3">
                  {BENEFITS.map((b) => (
                    <div key={b.title} className="flex items-center gap-1 rounded-md px-1.5 py-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="text-xs leading-none">{b.icon}</span>
                      <span className="text-white/70 text-[9px] font-medium leading-tight">{b.title}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep("checkout")} className="w-full h-10 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                  Subscribe · {fmt(plan.price)}
                </button>
                <div className="flex justify-center gap-3 mt-1.5">
                  <a href="#" className="text-white/25 text-[9px] hover:text-white/50 transition-colors">VIP Terms</a>
                  <a href="#" className="text-white/25 text-[9px] hover:text-white/50 transition-colors">Privacy Policy</a>
                </div>
              </>
            )}

            {/* Checkout */}
            {step === "checkout" && (
              <>
                {payStatus === "pending" ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(168,85,247,0.15)", border: "2px solid rgba(168,85,247,0.5)" }}>
                      <svg className="animate-spin" width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(168,85,247,0.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-white font-bold text-sm mb-1">Check your phone</p>
                    <p className="text-white/50 text-xs mb-1">A payment prompt of <span className="text-purple-400 font-semibold">{fmt(plan.price)}</span> has been sent to your mobile money number.</p>
                    <p className="text-white/30 text-[10px] mb-4">Approve it to activate your subscription. This page will update automatically.</p>
                    <div className="flex items-center justify-center gap-1.5 text-white/40 text-[10px]">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Waiting for payment confirmation…
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 p-3 rounded-xl flex items-center justify-between" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
                      <div>
                        <div className="text-white/50 text-[10px]">Selected plan</div>
                        <div className="text-white font-bold text-sm">{plan.label} · {fmt(plan.price)}</div>
                      </div>
                      <button onClick={() => { resetPayment(); setStep("plans"); }} className="text-purple-400 text-[10px] underline">Change</button>
                    </div>

                    <div className="rounded-xl overflow-hidden border mb-3" style={{ borderColor: "rgba(168,85,247,0.35)" }}>
                      <img src="https://pbs.twimg.com/media/Ggq-h4CXEAAv6wk.jpg" alt="Mobile Money" className="w-full object-cover" style={{ maxHeight: 70 }} />
                    </div>

                    <label className="block text-white/50 text-[10px] mb-1 font-medium">Mobile Money Number</label>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-xl mb-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <span className="text-white/40 text-xs font-medium flex-shrink-0">🇺🇬 +256</span>
                      <div className="w-px h-4 bg-white/15 flex-shrink-0" />
                      <input
                        type="tel"
                        placeholder="7XX XXX XXX"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setError(""); }}
                        className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/25"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                    <p className="text-white/30 text-[9px] mb-3">Enter the number to charge via Mobile Money</p>

                    {error && (
                      <div className="mb-2 px-3 py-2 rounded-lg text-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                        <p className="text-red-400 text-[10px]">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="w-full h-10 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                    >
                      {loading ? buttonLabel() : `Pay ${fmt(plan.price)} & Subscribe`}
                    </button>
                    <p className="text-white/25 text-[9px] text-center mt-1.5">You'll get a prompt on your phone to approve the payment</p>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    );
  }

  /* ── DESKTOP ── */
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: "90vh" }}>
        <button onClick={onClose} className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        {/* Left column */}
        <div className="flex-1 overflow-y-auto p-6 pt-8" style={{ background: "#13151a" }}>
          {step === "success" ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-white font-bold text-xl mb-2">Access Activated!</p>
              <p className="text-white/50 text-sm mb-1">Your <span className="text-purple-400 font-semibold">{plan.label}</span> subscription is now active.</p>
              <p className="text-white/30 text-xs">Enjoy all premium content until your plan expires.</p>
              <button onClick={onClose} className="mt-6 px-8 h-10 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Start Watching</button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)" }}>
                  {loggedInUser ? (
                    <span className="text-white text-sm font-bold uppercase">{loggedInUser.charAt(0)}</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </div>
                <span className="text-white font-semibold text-sm">{loggedInUser ? loggedInUser : <>Log in/Sign up &rsaquo;</>}</span>
              </div>
              <div className="flex gap-2 mb-3">
                {PLANS.map((p, i) => (
                  <button key={p.id} onClick={() => setSelectedPlan(i)}
                    className="relative flex-1 rounded-xl p-3 text-left transition-all border"
                    style={{ background: i === selectedPlan ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)", borderColor: i === selectedPlan ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)" }}
                  >
                    {p.discount > 0 && <div className="absolute -top-2 left-2 text-white text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>{p.discount}% off</div>}
                    <div className="text-white/70 text-xs mb-1 mt-1 leading-tight">{p.label} Subscription</div>
                    <div className="text-xl font-bold" style={{ color: i === selectedPlan ? "#a855f7" : "white" }}>UGX {p.price.toLocaleString()}</div>
                    <div className="text-white/30 text-xs line-through mt-0.5">UGX {p.original.toLocaleString()}</div>
                  </button>
                ))}
              </div>
              <p className="text-white/40 text-xs mb-5">· New subscribers get {plan.discount}% off the first term!</p>
              <h3 className="text-white font-bold text-base mb-3">VIP Membership Benefits</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Members Access",    desc: "Enjoy VIP exclusive content/episodes",  color: "#f59e0b" },
                  { title: "Multi-Device Access", desc: "One account on phone, PC, and TV",   color: "#8b5cf6" },
                  { title: "High Resolution",   desc: "Watch 1080P videos",                   color: "#ef4444" },
                  { title: "Early Access",      desc: "VIP members watch new episodes first",  color: "#06b6d4" },
                  { title: "Fast Download",     desc: "Boost up to 5 videos at once",          color: "#eab308" },
                  { title: "Pre-roll Ad Free",  desc: "Enjoy a clean, ad-free experience",     color: "#22c55e" },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: b.color }} />
                    <div>
                      <div className="text-white text-xs font-semibold leading-tight">{b.title}</div>
                      <div className="text-white/40 text-[11px] leading-snug mt-0.5">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right column – checkout */}
        {step !== "success" && (
          <div className="w-64 flex-shrink-0 flex flex-col p-5" style={{ background: "#0e1015", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            {payStatus === "pending" ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(168,85,247,0.1)", border: "2px solid rgba(168,85,247,0.4)" }}>
                  <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(168,85,247,0.25)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-white font-bold text-sm mb-2">Check your phone</p>
                <p className="text-white/50 text-xs mb-1">A payment prompt of <span className="text-purple-400 font-semibold">{fmt(plan.price)}</span> was sent to your mobile money number.</p>
                <p className="text-white/30 text-[11px] mt-2">Approve it to activate your subscription. This will update automatically.</p>
                <div className="flex items-center gap-1.5 mt-4 text-white/40 text-[10px]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Waiting for confirmation…
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-white/50 text-xs mb-1">You pay</div>
                  <div className="text-white font-bold text-2xl mb-2">{fmt(plan.price)}</div>
                  <div className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Save {fmt(saved)}</div>
                </div>
                <div className="border-t mb-4" style={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <div>
                  <div className="text-white text-xs font-semibold mb-2">Payment Method</div>
                  <div className="rounded-xl overflow-hidden border mb-3" style={{ borderColor: "rgba(168,85,247,0.4)" }}>
                    <img src="https://pbs.twimg.com/media/Ggq-h4CXEAAv6wk.jpg" alt="Mobile Money" className="w-full object-cover" style={{ maxHeight: 80 }} />
                  </div>
                  <div className="text-white text-xs font-semibold mb-1.5">Mobile Money Number</div>
                  <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg mb-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <span className="text-white/40 text-[10px] font-medium flex-shrink-0">🇺🇬 +256</span>
                    <div className="w-px h-3.5 bg-white/15 flex-shrink-0" />
                    <input
                      type="tel"
                      placeholder="7XX XXX XXX"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setError(""); }}
                      className="flex-1 bg-transparent outline-none text-white text-xs placeholder:text-white/25"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-white/30 text-[9px] mb-3">Number to charge via Mobile Money</p>
                  {error && (
                    <div className="mb-2 px-2 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <p className="text-red-400 text-[10px] text-center">{error}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1" />
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-bold text-sm text-white mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}
                >
                  {loading ? buttonLabel() : `Pay now · ${fmt(plan.price)}`}
                </button>
                <p className="text-white/25 text-[9px] text-center mt-1.5">You'll get a prompt on your phone to confirm</p>
                <div className="flex justify-center gap-2 mt-2">
                  <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">VIP Terms</a>
                  <a href="#" className="text-white/30 text-[10px] hover:text-white/60 transition-colors">Privacy Policy</a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
