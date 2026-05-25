import { useState } from "react";

const INCOME = 1500;
const SAVINGS_GOAL = 200;
const MONTHS = [
  { label: "Month 1", period: "Jun 13 – Jul 12", index: 0 },
  { label: "Month 2", period: "Jul 13 – Aug 12", index: 1 },
];

const BUDGET = {
  savings:      { label: "Savings",        amount: 200,  color: "#00E5A0", icon: "🏦" },
  rent:         { label: "Rent / Housing", amount: 550,  color: "#4F8EF7", icon: "🏠" },
  food:         { label: "Food & Dining",  amount: 350,  color: "#F7A84F", icon: "🍽️" },
  transport:    { label: "Transport",      amount: 100,  color: "#B06CF7", icon: "🚌" },
  subs:         { label: "Subscriptions",  amount: 80,   color: "#F76F6F", icon: "📱" },
  personal:     { label: "Personal / Misc",amount: 220,  color: "#F7DC4F", icon: "💼" },
};

const TIPS = [
  "Transfer $200 to savings on the 13th — before spending anything.",
  "Food & Dining is flexible. Cutting $50/month here = $100 extra saved in 2 months.",
  "Review subscriptions — cancel any you haven't used in 30 days.",
  "Use the last 3 days before payday as a spending freeze to arrive at zero cleanly.",
  "Track every purchase above $20 — awareness kills impulse spending.",
];

export default function SavingsTracker() {
  const [saved, setSaved] = useState([0, 0]);
  const [inputVal, setInputVal] = useState(["", ""]);
  const [activeMonth, setActiveMonth] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  const totalGoal = SAVINGS_GOAL * 2;
  const totalSaved = saved[0] + saved[1];
  const overallPct = Math.min((totalSaved / totalGoal) * 100, 100);

  function handleSave(monthIdx) {
    const val = parseFloat(inputVal[monthIdx]);
    if (isNaN(val) || val < 0) return;
    const next = [...saved];
    next[monthIdx] = Math.min(val, SAVINGS_GOAL);
    setSaved(next);
    const nextInput = [...inputVal];
    nextInput[monthIdx] = "";
    setInputVal(nextInput);
  }

  const budgetTotal = Object.values(BUDGET).reduce((s, b) => s + b.amount, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0E1A",
      color: "#E8EAF0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "24px 16px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .month-card { transition: all 0.2s ease; }
        .month-card:hover { transform: translateY(-2px); }
        .btn { cursor: pointer; transition: all 0.15s ease; border: none; }
        .btn:hover { opacity: 0.85; transform: scale(0.98); }
        .btn:active { transform: scale(0.95); }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        .tip-box { transition: all 0.3s ease; }
        .bar-fill { transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00E5A0", letterSpacing: 3, textTransform: "uppercase" }}>
            SAVINGS TRACKER
          </span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>
          Hey Ernesto 👋
        </h1>
        <p style={{ margin: "0 0 28px", color: "#7A8099", fontSize: 14 }}>
          Paid on the 13th · $1,500/mo · 2-month goal
        </p>

        {/* Overall Progress */}
        <div style={{
          background: "linear-gradient(135deg, #111827, #0f172a)",
          border: "1px solid #1E2740",
          borderRadius: 20,
          padding: "24px",
          marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#7A8099", marginBottom: 4 }}>TOTAL SAVED</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 36, fontWeight: 700, color: "#00E5A0" }}>
                  ${totalSaved}
                </span>
                <span style={{ color: "#7A8099", fontSize: 14 }}>/ ${totalGoal}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#7A8099", marginBottom: 4 }}>PROGRESS</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: overallPct === 100 ? "#00E5A0" : "#E8EAF0" }}>
                {Math.round(overallPct)}%
              </div>
            </div>
          </div>
          {/* Big progress bar */}
          <div style={{ background: "#1E2740", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <div className="bar-fill" style={{
              height: "100%",
              width: `${overallPct}%`,
              background: "linear-gradient(90deg, #00C87A, #00E5A0)",
              borderRadius: 999,
              boxShadow: "0 0 12px #00E5A060",
            }} />
          </div>
          {overallPct === 100 && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#00E5A0" }}>
              🎉 Goal reached! Amazing discipline.
            </div>
          )}
        </div>

        {/* Month Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {MONTHS.map((m) => {
            const pct = Math.min((saved[m.index] / SAVINGS_GOAL) * 100, 100);
            const isActive = activeMonth === m.index;
            return (
              <div
                key={m.index}
                className="month-card"
                onClick={() => setActiveMonth(m.index)}
                style={{
                  background: isActive ? "linear-gradient(135deg, #0D1F3C, #112240)" : "#111827",
                  border: isActive ? "1px solid #00E5A040" : "1px solid #1E2740",
                  borderRadius: 16,
                  padding: 20,
                  cursor: "pointer",
                  boxShadow: isActive ? "0 0 20px #00E5A020" : "none",
                }}
              >
                <div style={{ fontSize: 11, color: "#7A8099", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 10, color: "#4A5470", marginBottom: 12 }}>{m.period}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: pct === 100 ? "#00E5A0" : "#E8EAF0", marginBottom: 10 }}>
                  ${saved[m.index]}
                  <span style={{ fontSize: 12, color: "#4A5470", fontWeight: 400 }}>/${SAVINGS_GOAL}</span>
                </div>
                <div style={{ background: "#1E2740", borderRadius: 999, height: 6, overflow: "hidden" }}>
                  <div className="bar-fill" style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: pct === 100 ? "#00E5A0" : "#4F8EF7",
                    borderRadius: 999,
                  }} />
                </div>
                {pct === 100 && <div style={{ fontSize: 11, color: "#00E5A0", marginTop: 6 }}>✓ Saved!</div>}
              </div>
            );
          })}
        </div>

        {/* Log Savings Input */}
        <div style={{
          background: "#111827",
          border: "1px solid #1E2740",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, color: "#7A8099", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Log Saved — {MONTHS[activeMonth].label}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="number"
              placeholder="Enter amount saved ($)"
              value={inputVal[activeMonth]}
              onChange={(e) => {
                const next = [...inputVal];
                next[activeMonth] = e.target.value;
                setInputVal(next);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave(activeMonth)}
              style={{
                flex: 1,
                background: "#0A0E1A",
                border: "1px solid #1E2740",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#E8EAF0",
                fontSize: 15,
                outline: "none",
                fontFamily: "'Space Mono', monospace",
              }}
            />
            <button
              className="btn"
              onClick={() => handleSave(activeMonth)}
              style={{
                background: "#00E5A0",
                color: "#0A0E1A",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Log
            </button>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div style={{
          background: "#111827",
          border: "1px solid #1E2740",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, color: "#7A8099", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            Monthly Budget Breakdown
          </div>
          {Object.entries(BUDGET).map(([key, cat]) => {
            const pct = (cat.amount / INCOME) * 100;
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{cat.icon} {cat.label}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: cat.color }}>
                    ${cat.amount} <span style={{ color: "#4A5470" }}>({Math.round(pct)}%)</span>
                  </span>
                </div>
                <div style={{ background: "#1E2740", borderRadius: 999, height: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: cat.color,
                    borderRadius: 999,
                    opacity: 0.8,
                  }} />
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #1E2740", marginTop: 14, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#7A8099" }}>Remaining (buffer)</span>
            <span style={{ fontFamily: "'Space Mono', monospace", color: "#00E5A0" }}>
              ${INCOME - budgetTotal}
            </span>
          </div>
        </div>

        {/* Money Tips */}
        <div
          className="tip-box"
          style={{
            background: "linear-gradient(135deg, #0D1F3C, #0A1628)",
            border: "1px solid #00E5A030",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#00E5A0", letterSpacing: 1, textTransform: "uppercase" }}>
              💡 Money Tip
            </div>
            <button
              className="btn"
              onClick={() => setTipIdx((tipIdx + 1) % TIPS.length)}
              style={{
                background: "#1E2740",
                color: "#7A8099",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Next →
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#B0BAD0" }}>
            {TIPS[tipIdx]}
          </p>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {TIPS.map((_, i) => (
              <div key={i} style={{
                width: i === tipIdx ? 16 : 4,
                height: 4,
                borderRadius: 999,
                background: i === tipIdx ? "#00E5A0" : "#1E2740",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }} onClick={() => setTipIdx(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}