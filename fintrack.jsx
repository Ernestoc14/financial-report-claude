import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area
} from "recharts";
import {
  Plus, X, Trash2, Target, CreditCard, Settings,
  LayoutDashboard, DollarSign, BarChart2, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle, Check, Edit3
} from "lucide-react";

// ─────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────
const T = {
  bg:     "#050C17",
  card:   "#0B1527",
  card2:  "#0F1E35",
  border: "#172A45",
  gold:   "#CFA84C",
  gold2:  "#E8C96A",
  blue:   "#3D8EFF",
  green:  "#00C896",
  red:    "#FF4444",
  orange: "#FF9440",
  purple: "#9B87FF",
  pink:   "#FF6B9D",
  t1:     "#DDE6F5",
  t2:     "#5E7E9E",
  t3:     "#1E3352",
};

// ─────────────────────────────────────────────
//  DEFAULTS
// ─────────────────────────────────────────────
const PAYDAY = 13;

const CATS_DEF = [
  { id:"vivienda",       name:"Vivienda",       icon:"🏠", color:T.blue,   pct:28 },
  { id:"comida",         name:"Alimentación",   icon:"🍽️", color:T.orange, pct:14 },
  { id:"transporte",     name:"Transporte",     icon:"🚗", color:T.purple, pct:8  },
  { id:"gym",            name:"Gym & Salud",    icon:"💪", color:T.green,  pct:5  },
  { id:"entretenimiento",name:"Entret.",        icon:"🎬", color:T.pink,   pct:7  },
  { id:"suscripciones",  name:"Suscripciones",  icon:"📱", color:"#A569BD",pct:3  },
  { id:"personal",       name:"Personal",       icon:"❤️", color:T.pink,   pct:5  },
  { id:"ahorro",         name:"Ahorro",         icon:"🎯", color:T.gold,   pct:20 },
  { id:"otros",          name:"Otros",          icon:"📦", color:T.t2,     pct:10 },
];

const ACCS_DEF = [
  { id:"a1", name:"BAC Corriente", bank:"BAC", type:"checking", balance:0, color:T.blue  },
  { id:"a2", name:"BAC Ahorros",   bank:"BAC", type:"savings",  balance:0, color:T.green },
  { id:"a3", name:"VISA Platinum", bank:"BAC", type:"credit",   balance:0, limit:3000, color:T.gold },
];

const GOALS_DEF = [
  { id:"g1", name:"Fondo de Emergencia", target:5000, saved:0, color:T.green, note:"6 meses de gastos" },
  { id:"g2", name:"Viaje / Vacaciones",  target:2000, saved:0, color:T.blue,  note:"" },
  { id:"g3", name:"Inversión ETF",       target:10000,saved:0, color:T.gold,  note:"S&P 500" },
];

// ─────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────
const $f = (n) =>
  "$" + Math.abs(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function paydayInfo() {
  const now = new Date(), d = now.getDate(), m = now.getMonth(), y = now.getFullYear();
  const last = d >= PAYDAY ? new Date(y, m, PAYDAY) : new Date(y, m - 1, PAYDAY);
  const next = d >= PAYDAY ? new Date(y, m + 1, PAYDAY) : new Date(y, m, PAYDAY);
  const DAY = 86400000;
  const until  = Math.max(0, Math.ceil((next - now) / DAY));
  const since  = Math.floor((now - last) / DAY);
  const total  = Math.floor((next - last) / DAY);
  const pct    = Math.min(1, since / total);
  // weekly slices: 30/25/25/20
  const weekSlices = [0.30, 0.25, 0.25, 0.20];
  const weekIdx = Math.min(3, Math.floor(since / 7));
  return { until, since, total, pct, last, next, weekIdx, weekSlices };
}

// ─────────────────────────────────────────────
//  STORAGE
// ─────────────────────────────────────────────
const SKEYS = ["income","accounts","categories","expenses","goals","setup"];
async function loadAll() {
  const out = {};
  for (const k of SKEYS) {
    try {
      const r = await window.storage.get("ft:" + k);
      if (r) out[k] = JSON.parse(r.value);
    } catch {}
  }
  return out;
}
async function save(k, v) {
  try { await window.storage.set("ft:" + k, JSON.stringify(v)); } catch {}
}

// ─────────────────────────────────────────────
//  SETUP WIZARD
// ─────────────────────────────────────────────
function SetupWizard({ onDone }) {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState("");
  const [accounts, setAccounts] = useState(ACCS_DEF);
  const [goals, setGoals] = useState(GOALS_DEF);

  const inp = {
    width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
    padding: "10px 14px", color: T.t1, fontSize: 14, fontFamily: "'JetBrains Mono',monospace",
    outline: "none", marginBottom: 14,
  };
  const lbl = { fontSize: 11, color: T.t2, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5, display: "block" };
  const btn = (p) => ({
    padding: "11px 22px", borderRadius: 8, border: p ? "none" : `1px solid ${T.border}`,
    cursor: "pointer", fontSize: 13, fontWeight: 700,
    background: p ? T.gold : "transparent", color: p ? T.bg : T.t2, fontFamily: "inherit",
  });

  const steps = [
    /* 0 – income */
    <div key={0}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: T.gold, marginBottom: 8 }}>
        ¡Bienvenido, Ernesto! 👋
      </div>
      <div style={{ fontSize: 13, color: T.t2, marginBottom: 28, lineHeight: 1.7 }}>
        Vamos a configurar tu tracker financiero personal.<br/>
        Empecemos con tu <strong style={{ color: T.t1 }}>ingreso mensual neto</strong> (lo que recibes el día 13).
      </div>
      <label style={lbl}>Ingreso mensual neto (USD)</label>
      <input style={inp} type="number" autoFocus placeholder="ej. 2500.00"
        value={income} onChange={(e) => setIncome(e.target.value)} />
      {income > 0 && (
        <div style={{ background: "rgba(0,200,150,0.08)", border: `1px solid ${T.green}33`, borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: T.t2, marginBottom: 6 }}>Distribución sugerida (Regla 20/35/30/15):</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              { l: "🎯 Ahorro (20%)", v: income * 0.20, c: T.gold },
              { l: "🏠 Fijos (35%)",  v: income * 0.35, c: T.blue },
              { l: "🍽️ Variables (30%)", v: income * 0.30, c: T.orange },
              { l: "🛡️ Buffer (15%)",  v: income * 0.15, c: T.green },
            ].map((r) => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: T.t2 }}>{r.l}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", color: r.c }}>{$f(r.v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={btn(true)} disabled={!income || +income <= 0} onClick={() => income > 0 && setStep(1)}>
          Siguiente →
        </button>
      </div>
    </div>,

    /* 1 – accounts */
    <div key={1}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: T.gold, marginBottom: 8 }}>Tus cuentas 🏦</div>
      <div style={{ fontSize: 13, color: T.t2, marginBottom: 24, lineHeight: 1.6 }}>Configura tus cuentas y tarjetas. Puedes editarlas después.</div>
      {accounts.map((acc, i) => (
        <div key={acc.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: acc.type === "credit" ? 8 : 0 }}>
            <input style={{ ...inp, flex: 1, marginBottom: 0 }} value={acc.name}
              onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], name: e.target.value }; setAccounts(a); }}
              placeholder="Nombre" />
            <input style={{ ...inp, width: 120, marginBottom: 0 }} type="number"
              value={acc.balance || ""} placeholder={acc.type === "credit" ? "Saldo usado" : "Saldo"}
              onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], balance: +e.target.value }; setAccounts(a); }} />
          </div>
          {acc.type === "credit" && (
            <input style={{ ...inp, marginBottom: 0, marginTop: 8 }} type="number"
              value={acc.limit || ""} placeholder="Límite de crédito"
              onChange={(e) => { const a = [...accounts]; a[i] = { ...a[i], limit: +e.target.value }; setAccounts(a); }} />
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button style={btn(false)} onClick={() => setStep(0)}>← Atrás</button>
        <button style={btn(true)} onClick={() => setStep(2)}>Siguiente →</button>
      </div>
    </div>,

    /* 2 – goals */
    <div key={2}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, color: T.gold, marginBottom: 8 }}>Metas de ahorro 🎯</div>
      <div style={{ fontSize: 13, color: T.t2, marginBottom: 24, lineHeight: 1.6 }}>
        Define tus metas a largo plazo. El <strong style={{ color: T.gold }}>20% mensual</strong> se distribuirá entre estas metas.
      </div>
      {goals.map((g, i) => (
        <div key={g.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input style={{ ...inp, flex: 1, marginBottom: 0 }} value={g.name}
            onChange={(e) => { const gs = [...goals]; gs[i] = { ...gs[i], name: e.target.value }; setGoals(gs); }}
            placeholder="Nombre de la meta" />
          <input style={{ ...inp, width: 120, marginBottom: 0 }} type="number"
            value={g.target || ""} placeholder="Meta $"
            onChange={(e) => { const gs = [...goals]; gs[i] = { ...gs[i], target: +e.target.value }; setGoals(gs); }} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
        <button style={btn(false)} onClick={() => setStep(1)}>← Atrás</button>
        <button style={btn(true)} onClick={() => onDone({ income: +income, accounts, goals, categories: CATS_DEF })}>
          ¡Listo! 🚀
        </button>
      </div>
    </div>,
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 40, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? T.gold : T.border, transition: "background 0.3s" }} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SHARED COMPONENTS
// ─────────────────────────────────────────────
function Card({ children, style = {}, accent }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22,
      borderTop: accent ? `2px solid ${accent}` : undefined, ...style,
    }}>{children}</div>
  );
}

function StatCard({ label, value, sub, color, accent }) {
  return (
    <Card accent={accent || T.border}>
      <div style={{ fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: color || T.t1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.t3 }}>{sub}</div>}
    </Card>
  );
}

const ChartTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.t1, marginBottom: 2 }}>{p.name}: {$f(p.value)}</div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
//  DASHBOARD VIEW
// ─────────────────────────────────────────────
function DashboardView({ income, categories, cycleExp, totalSpent, totalSaved, available, catChartData, pieData, pi, setShowModal, expenses }) {
  const savingsRate = income > 0 ? (totalSaved / income * 100).toFixed(1) : 0;
  const spendingPct = income > 0 ? totalSpent / income * 100 : 0;
  const cycleExpectedPct = pi.pct * 100;
  const overspending = spendingPct > cycleExpectedPct + 5;
  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const weekLabels = ["Sem 1 (d0–7)", "Sem 2 (d7–14)", "Sem 3 (d14–21)", "Sem 4+ (d21→)"];
  const varBudget = income * categories.filter(c => !["vivienda","suscripciones","ahorro"].includes(c.id)).reduce((s,c)=>s+c.pct,0) / 100;
  const weekBudget = varBudget * pi.weekSlices[pi.weekIdx];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Dashboard</div>
          <div style={{ fontSize: 13, color: T.t2 }}>
            Ciclo día <span style={{ color: T.t1 }}>{pi.since}</span> de <span style={{ color: T.t1 }}>{pi.total}</span> · Próximo pago en{" "}
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: pi.until <= 7 ? T.red : pi.until <= 14 ? T.orange : T.green, fontWeight: 600 }}>{pi.until}d</span>
          </div>
        </div>
        <button onClick={() => setShowModal("expense")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: T.gold, color: T.bg, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> Registrar Gasto
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard label="Ingreso Mensual" value={$f(income)} sub="Día 13 de cada mes" color={T.gold} accent={T.gold} />
        <StatCard label="Gastado" value={$f(totalSpent)} sub={`${spendingPct.toFixed(1)}% del ingreso`} color={T.red} accent={T.red} />
        <StatCard label="Ahorrado" value={$f(totalSaved)} sub={`Tasa: ${savingsRate}%`} color={T.green} accent={T.green} />
        <StatCard label="Disponible" value={$f(available)} sub={`${pi.until} días para recarga`} color={available < 0 ? T.red : T.t1} accent={available < 0 ? T.red : T.blue} />
      </div>

      {/* Cycle progress */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Progreso del Ciclo de Pago</span>
          <span style={{ fontSize: 12, color: T.t2 }}>{weekLabels[pi.weekIdx]}</span>
        </div>
        <div style={{ position: "relative", background: T.bg, borderRadius: 8, height: 10, overflow: "visible", marginBottom: 8 }}>
          {/* Expected line */}
          <div style={{ position: "absolute", left: `${pi.pct * 100}%`, top: -4, bottom: -4, width: 2, background: T.t2, zIndex: 2, borderRadius: 1 }} />
          {/* Spent bar */}
          <div style={{ height: "100%", borderRadius: 8, transition: "width 0.6s",
            background: `linear-gradient(90deg, ${T.blue}, ${overspending ? T.red : T.blue})`,
            width: `${Math.min(100, spendingPct)}%`, boxShadow: `0 0 8px ${overspending ? T.red : T.blue}44` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
          <span style={{ color: T.t2 }}>Gastado: <span style={{ color: overspending ? T.red : T.t1 }}>{spendingPct.toFixed(1)}%</span></span>
          <span style={{ color: T.t3 }}>│ Esperado: {cycleExpectedPct.toFixed(0)}%</span>
          <span style={{ color: T.t2 }}>Semana budget: <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.gold }}>{$f(weekBudget)}</span></span>
        </div>
        {overspending && (
          <div style={{ marginTop: 10, background: "rgba(255,68,68,0.08)", border: `1px solid rgba(255,68,68,0.25)`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: T.red, display: "flex", gap: 8, alignItems: "center" }}>
            <AlertCircle size={13} /> Ritmo de gasto por encima de lo esperado para este punto del ciclo
          </div>
        )}
      </Card>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Presupuesto vs Gasto por Categoría</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.t3} vertical={false} />
              <XAxis dataKey="icon" tick={{ fill: T.t2, fontSize: 14 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.t2, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => v > 0 ? `$${v}` : ""} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="budget" name="Presupuesto" fill={T.t3} radius={[3, 3, 0, 0]} />
              <Bar dataKey="gastado" name="Gastado" radius={[3, 3, 0, 0]}>
                {catChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.gastado > entry.budget ? T.red : entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Distribución de Gastos</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={2} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [$f(v), "Gasto"]} contentStyle={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 6 }}>
                {pieData.slice(0, 5).map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: T.t2 }}>{d.name}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{$f(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: T.t3, fontSize: 12, gap: 8 }}>
              <div style={{ fontSize: 28 }}>📊</div>
              Sin gastos registrados
            </div>
          )}
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Transacciones Recientes</div>
        {recent.length === 0 ? (
          <div style={{ textAlign: "center", color: T.t3, padding: "24px 0", fontSize: 12 }}>
            Aún no hay transacciones. ¡Registra tu primer gasto!
          </div>
        ) : (
          recent.map((e, idx) => {
            const cat = CATS_DEF.find((c) => c.id === e.catId) || { icon: "📦", name: "Otros", color: T.t2 };
            return (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: idx < recent.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{e.desc}</div>
                  <div style={{ fontSize: 11, color: T.t2 }}>{e.date} · {cat.name}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: e.catId === "ahorro" ? T.green : T.red, fontWeight: 600 }}>
                  {e.catId === "ahorro" ? "+" : "-"}{$f(e.amount)}
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
//  EXPENSES VIEW
// ─────────────────────────────────────────────
function ExpensesView({ expenses, setExpensesSave, categories, accounts, setShowModal }) {
  const [filter, setFilter] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const sorted = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((e) => {
      const t = !filter || e.desc.toLowerCase().includes(filter.toLowerCase());
      const c = catFilter === "all" || e.catId === catFilter;
      return t && c;
    });

  const total = sorted.reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Gastos</div>
          <div style={{ fontSize: 13, color: T.t2 }}>{sorted.length} transacciones · Total: <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.t1 }}>{$f(total)}</span></div>
        </div>
        <button onClick={() => setShowModal("expense")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: T.gold, color: T.bg, border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> Nuevo Gasto
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="🔍  Buscar gasto..."
          style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", color: T.t1, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", color: T.t2, fontSize: 13, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
          <option value="all">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: T.t3, fontSize: 13 }}>Sin resultados</div>
        ) : (
          sorted.map((e, i) => {
            const cat = categories.find((c) => c.id === e.catId) || { icon: "📦", name: "Otros", color: T.t2 };
            const acc = accounts.find((a) => a.id === e.accId);
            return (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < sorted.length - 1 ? `1px solid ${T.border}` : "none", background: i % 2 === 0 ? "transparent" : T.bg + "88" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{e.desc}</div>
                  <div style={{ fontSize: 11, color: T.t2 }}>{e.date} · {cat.name}{acc ? ` · ${acc.name}` : ""}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600, color: e.catId === "ahorro" ? T.green : T.t1, flexShrink: 0 }}>
                  {e.catId === "ahorro" ? "+" : "-"}{$f(e.amount)}
                </div>
                <button onClick={() => setExpensesSave(expenses.filter((x) => x.id !== e.id))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: T.t3, padding: "4px", flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ACCOUNTS VIEW
// ─────────────────────────────────────────────
function AccountsView({ accounts, setAccountsSave, expenses, setShowModal }) {
  const pi = paydayInfo();
  const cycleExp = expenses.filter((e) => new Date(e.date) >= pi.last);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Cuentas</div>
          <div style={{ fontSize: 13, color: T.t2 }}>Bancos y tarjetas de crédito</div>
        </div>
        <button onClick={() => setShowModal("account")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, color: T.t1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Checking / Savings */}
      <div style={{ fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Cuentas de Banco</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginBottom: 28 }}>
        {accounts.filter((a) => a.type !== "credit").map((acc) => {
          const used = cycleExp.filter((e) => e.accId === acc.id).reduce((s, e) => s + e.amount, 0);
          const usedPct = acc.balance > 0 ? (used / acc.balance) * 100 : 0;
          return (
            <Card key={acc.id} style={{ borderLeft: `3px solid ${acc.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: T.t2, marginBottom: 4 }}>{acc.bank} · {acc.type === "savings" ? "Ahorros" : "Corriente"}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{acc.name}</div>
                </div>
                <div style={{ fontSize: 24 }}>{acc.type === "savings" ? "💰" : "🏦"}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, color: acc.color, marginBottom: 6 }}>{$f(acc.balance)}</div>
              <div style={{ fontSize: 11, color: T.t3, marginBottom: 10 }}>Gastado este ciclo: <span style={{ color: T.t2 }}>{$f(used)}</span></div>
              <div style={{ background: T.bg, borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", background: acc.color, width: `${Math.min(100, usedPct)}%`, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                <button onClick={() => {
                  const nb = +prompt("Nuevo saldo:", acc.balance);
                  if (!isNaN(nb)) setAccountsSave(accounts.map((a) => a.id === acc.id ? { ...a, balance: nb } : a));
                }} style={{ fontSize: 11, color: T.t2, background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                  Actualizar saldo
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Credit cards */}
      {accounts.filter((a) => a.type === "credit").length > 0 && (
        <>
          <div style={{ fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Tarjetas de Crédito</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
            {accounts.filter((a) => a.type === "credit").map((acc) => {
              const used = acc.balance || 0;
              const limit = acc.limit || 0;
              const available = limit - used;
              const pct = limit > 0 ? (used / limit) * 100 : 0;
              const statusColor = pct > 80 ? T.red : pct > 60 ? T.orange : T.green;
              return (
                <Card key={acc.id} style={{ background: `linear-gradient(135deg, ${T.card} 0%, ${T.card2} 100%)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T.t2, marginBottom: 4 }}>{acc.bank} · Crédito</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{acc.name}</div>
                    </div>
                    <div style={{ fontSize: 26 }}>💳</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {[
                      { l: "USADO",      v: used,      c: T.red   },
                      { l: "DISPONIBLE", v: available, c: T.green },
                      { l: "LÍMITE",     v: limit,     c: T.t2    },
                    ].map((r) => (
                      <div key={r.l}>
                        <div style={{ fontSize: 9, color: T.t3, letterSpacing: "0.1em", marginBottom: 5 }}>{r.l}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, color: r.c }}>{$f(r.v)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: T.bg, borderRadius: 6, height: 8, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", borderRadius: 6, background: statusColor, width: `${Math.min(100, pct)}%`, transition: "width 0.5s", boxShadow: `0 0 6px ${statusColor}66` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                    <span style={{ color: statusColor, fontWeight: 600 }}>Uso: {pct.toFixed(1)}%</span>
                    <span style={{ color: T.t3 }}>Meta: mantener &lt;30%</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={() => {
                      const nb = +prompt("Saldo usado:", used);
                      if (!isNaN(nb)) setAccountsSave(accounts.map((a) => a.id === acc.id ? { ...a, balance: nb } : a));
                    }} style={{ flex: 1, fontSize: 11, color: T.t2, background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px", cursor: "pointer", fontFamily: "inherit" }}>
                      Actualizar saldo
                    </button>
                    <button onClick={() => {
                      if (confirm("¿Eliminar esta cuenta?")) setAccountsSave(accounts.filter((a) => a.id !== acc.id));
                    }} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 10px", cursor: "pointer", color: T.t3 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  GOALS VIEW
// ─────────────────────────────────────────────
function GoalsView({ goals, setGoalsSave, income, setShowModal }) {
  const monthlySavings = income * 0.20;
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved  = goals.reduce((s, g) => s + g.saved,  0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Metas de Ahorro</div>
          <div style={{ fontSize: 13, color: T.t2 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.gold }}>{$f(totalSaved)}</span> de{" "}
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{$f(totalTarget)}</span> acumulado
          </div>
        </div>
        <button onClick={() => setShowModal("goal")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, color: T.t1, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          <Plus size={15} /> Nueva Meta
        </button>
      </div>

      {/* Monthly savings banner */}
      <Card accent={T.gold} style={{ marginBottom: 24, background: `linear-gradient(135deg, ${T.card} 0%, ${T.card2} 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Ahorro mensual automático (20% del ingreso)</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 30, fontWeight: 700, color: T.gold }}>{$f(monthlySavings)}</div>
            <div style={{ fontSize: 12, color: T.t2, marginTop: 6 }}>
              Distribuye el día 13 · {$f(goals.length > 0 ? monthlySavings / goals.length : 0)} por meta/mes
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: T.t3 }}>Total faltante</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, color: T.t1 }}>{$f(totalTarget - totalSaved)}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {goals.map((g) => {
          const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
          const remaining = g.target - g.saved;
          const mPerGoal = goals.length > 0 ? monthlySavings / goals.length : 0;
          const monthsLeft = mPerGoal > 0 ? Math.ceil(remaining / mPerGoal) : 999;
          return (
            <Card key={g.id} accent={g.color}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{g.name}</div>
                  {g.note && <div style={{ fontSize: 11, color: T.t2 }}>{g.note}</div>}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: g.color, background: g.color + "22", padding: "4px 10px", borderRadius: 20 }}>
                  {pct.toFixed(1)}%
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 700, color: g.color }}>{$f(g.saved)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: T.t2 }}>/ {$f(g.target)}</span>
                </div>
                <div style={{ background: T.bg, borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 6, background: g.color, width: `${pct}%`, transition: "width 0.6s", boxShadow: `0 0 8px ${g.color}55` }} />
                </div>
              </div>
              <div style={{ fontSize: 11, color: T.t3, marginBottom: 14 }}>
                Faltan <span style={{ fontFamily: "'JetBrains Mono',monospace", color: T.t1 }}>{$f(remaining)}</span> · ~<span style={{ color: T.t1 }}>{monthsLeft}</span> meses
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => {
                  const n = +prompt("¿Cuánto agregar a esta meta? ($)", "");
                  if (n > 0) setGoalsSave(goals.map((x) => x.id === g.id ? { ...x, saved: x.saved + n } : x));
                }} style={{ flex: 1, background: g.color + "22", border: `1px solid ${g.color}44`, borderRadius: 8, padding: "8px", color: g.color, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  + Agregar
                </button>
                <button onClick={() => setGoalsSave(goals.filter((x) => x.id !== g.id))}
                  style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.t3, cursor: "pointer" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </Card>
          );
        })}
        {goals.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: T.t3, fontSize: 13 }}>
            Sin metas. ¡Agrega una!
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  BUDGET VIEW
// ─────────────────────────────────────────────
function BudgetView({ income, setIncomeSave, categories, setCategoriesSave, cycleExp }) {
  const [editIncome, setEditIncome] = useState(false);
  const [newIncome, setNewIncome] = useState(income);
  const totalPct = categories.reduce((s, c) => s + c.pct, 0);

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Presupuesto</div>
      <div style={{ fontSize: 13, color: T.t2, marginBottom: 24 }}>Asignación mensual por categoría</div>

      {/* Income editor */}
      <Card accent={T.gold} style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Ingreso Mensual Neto</div>
          {editIncome ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" value={newIncome} onChange={(e) => setNewIncome(e.target.value)}
                style={{ background: T.bg, border: `1px solid ${T.gold}`, borderRadius: 8, padding: "8px 12px", color: T.gold, fontSize: 20, fontFamily: "'JetBrains Mono',monospace", width: 160, outline: "none" }} autoFocus />
              <button onClick={() => { setIncomeSave(+newIncome); setEditIncome(false); }}
                style={{ background: T.gold, color: T.bg, border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700 }}><Check size={14} /></button>
              <button onClick={() => setEditIncome(false)}
                style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.t2, cursor: "pointer" }}><X size={14} /></button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: T.gold }}>{$f(income)}</div>
              <button onClick={() => { setNewIncome(income); setEditIncome(true); }}
                style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", color: T.t2, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                <Edit3 size={12} style={{ marginRight: 4 }} />Editar
              </button>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: totalPct === 100 ? T.green : T.red, fontWeight: 600 }}>Asignado: {totalPct}%</div>
          <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>Meta: exactamente 100%</div>
        </div>
      </Card>

      {/* Plan Semanal */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Plan Semanal · Día 13 al 13</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {["Sem 1\nd0–7", "Sem 2\nd7–14", "Sem 3\nd14–21", "Sem 4\nd21+"].map((lbl, i) => {
            const varBudget = income * categories.filter(c => !["vivienda","suscripciones","ahorro"].includes(c.id)).reduce((s,c)=>s+c.pct,0) / 100;
            const slices = [0.30, 0.25, 0.25, 0.20];
            const amt = varBudget * slices[i];
            const pi = paydayInfo();
            const isCurrent = pi.weekIdx === i;
            return (
              <div key={i} style={{ background: isCurrent ? T.gold + "15" : T.bg, border: `1px solid ${isCurrent ? T.gold : T.border}`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: isCurrent ? T.gold : T.t2, marginBottom: 6, whiteSpace: "pre-line", lineHeight: 1.4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{lbl}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: isCurrent ? T.gold : T.t1 }}>{$f(amt)}</div>
                <div style={{ fontSize: 10, color: T.t3, marginTop: 4 }}>{(slices[i] * 100).toFixed(0)}% variable</div>
                {isCurrent && <div style={{ fontSize: 9, color: T.gold, marginTop: 6, fontWeight: 700 }}>← ACTUAL</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 80px 120px 100px 110px", gap: 12, fontSize: 9, color: T.t2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>Categoría</span><span>%</span><span>Asignado</span><span>Gastado</span><span>Estado</span>
        </div>
        {categories.map((cat, i) => {
          const budget  = income * cat.pct / 100;
          const spent   = cycleExp.filter((e) => e.catId === cat.id).reduce((s, e) => s + e.amount, 0);
          const over    = spent > budget;
          const spentPct = budget > 0 ? spent / budget * 100 : 0;
          return (
            <div key={cat.id} style={{ padding: "13px 22px", borderBottom: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 80px 120px 100px 110px", gap: 12, alignItems: "center", background: i % 2 === 0 ? "transparent" : T.bg + "66" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{cat.name}</div>
                  <div style={{ height: 3, background: T.bg, borderRadius: 2, marginTop: 4, width: 80, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: over ? T.red : cat.color, width: `${Math.min(100, spentPct)}%` }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input type="number" value={cat.pct} min={0} max={100}
                  onChange={(e) => setCategoriesSave(categories.map((c) => c.id === cat.id ? { ...c, pct: +e.target.value } : c))}
                  style={{ width: 52, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 7px", color: cat.color, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", outline: "none", textAlign: "right" }} />
                <span style={{ fontSize: 11, color: T.t2 }}>%</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{$f(budget)}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: over ? T.red : T.t1 }}>{$f(spent)}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: over ? T.red : spent === 0 ? T.t3 : T.green }}>
                {over ? `⚠️ +${$f(spent - budget)}` : spent === 0 ? "—" : `✓ ${$f(budget - spent)} libre`}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MODALS
// ─────────────────────────────────────────────
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 };
const mbox = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" };
const inp = { width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.t1, fontSize: 14, fontFamily: "'JetBrains Mono',monospace", outline: "none", marginBottom: 14 };
const lbl = { fontSize: 10, color: T.t2, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5, display: "block" };
const submitBtn = { width: "100%", background: T.gold, color: T.bg, border: "none", borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 6 };

function AddExpenseModal({ expenses, setExpensesSave, categories, accounts, onClose }) {
  const [f, setF] = useState({ desc: "", amount: "", catId: "comida", accId: accounts[0]?.id || "", date: todayStr() });
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const submit = () => {
    if (!f.desc || +f.amount <= 0) return;
    setExpensesSave([...expenses, { ...f, id: uid(), amount: +f.amount }]);
    onClose();
  };
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={mbox}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Registrar Gasto</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.t2, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <label style={lbl}>Descripción</label>
        <input style={inp} autoFocus value={f.desc} onChange={(e) => upd("desc", e.target.value)} placeholder="ej. Supermercado, Uber, Netflix…" />
        <label style={lbl}>Monto (USD)</label>
        <input style={{ ...inp, color: T.gold, fontSize: 20 }} type="number" value={f.amount} onChange={(e) => upd("amount", e.target.value)} placeholder="0.00" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={lbl}>Categoría</label>
            <select value={f.catId} onChange={(e) => upd("catId", e.target.value)}
              style={{ ...inp, marginBottom: 0, cursor: "pointer", color: T.t1 }}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Cuenta</label>
            <select value={f.accId} onChange={(e) => upd("accId", e.target.value)}
              style={{ ...inp, marginBottom: 0, cursor: "pointer", color: T.t1 }}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <label style={{ ...lbl, marginTop: 14 }}>Fecha</label>
        <input style={inp} type="date" value={f.date} onChange={(e) => upd("date", e.target.value)} />
        <button style={submitBtn} onClick={submit}>+ Registrar Gasto</button>
      </div>
    </div>
  );
}

function AddAccountModal({ accounts, setAccountsSave, onClose }) {
  const [f, setF] = useState({ name: "", bank: "", type: "checking", balance: "", limit: "" });
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const submit = () => {
    if (!f.name) return;
    const colors = [T.blue, T.green, T.purple, T.orange, T.gold];
    setAccountsSave([...accounts, { ...f, id: uid(), balance: +f.balance || 0, limit: +f.limit || 0, color: colors[accounts.length % colors.length] }]);
    onClose();
  };
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...mbox, maxWidth: 380 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Agregar Cuenta</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.t2, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <label style={lbl}>Nombre de la cuenta</label>
        <input style={inp} autoFocus value={f.name} onChange={(e) => upd("name", e.target.value)} placeholder="ej. Banistmo Corriente" />
        <label style={lbl}>Banco</label>
        <input style={inp} value={f.bank} onChange={(e) => upd("bank", e.target.value)} placeholder="ej. BAC, Banistmo, General" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={lbl}>Tipo</label>
            <select value={f.type} onChange={(e) => upd("type", e.target.value)}
              style={{ ...inp, marginBottom: 0, cursor: "pointer", color: T.t1 }}>
              <option value="checking">Corriente</option>
              <option value="savings">Ahorros</option>
              <option value="credit">Crédito</option>
            </select>
          </div>
          <div>
            <label style={lbl}>{f.type === "credit" ? "Saldo Usado" : "Saldo Actual"}</label>
            <input style={{ ...inp, marginBottom: 0 }} type="number" value={f.balance} onChange={(e) => upd("balance", e.target.value)} placeholder="0.00" />
          </div>
        </div>
        {f.type === "credit" && (
          <>
            <label style={{ ...lbl, marginTop: 14 }}>Límite de crédito</label>
            <input style={inp} type="number" value={f.limit} onChange={(e) => upd("limit", e.target.value)} placeholder="3000.00" />
          </>
        )}
        <button style={submitBtn} onClick={submit}>Agregar Cuenta</button>
      </div>
    </div>
  );
}

function AddGoalModal({ goals, setGoalsSave, onClose }) {
  const [f, setF] = useState({ name: "", target: "", note: "" });
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const submit = () => {
    if (!f.name || !+f.target) return;
    const colors = [T.green, T.blue, T.purple, T.gold, T.orange, T.pink];
    setGoalsSave([...goals, { ...f, id: uid(), target: +f.target, saved: 0, color: colors[goals.length % colors.length] }]);
    onClose();
  };
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...mbox, maxWidth: 360 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Nueva Meta de Ahorro</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.t2, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <label style={lbl}>Nombre</label>
        <input style={inp} autoFocus value={f.name} onChange={(e) => upd("name", e.target.value)} placeholder="ej. Auto, Laptop, ETF…" />
        <label style={lbl}>Monto objetivo (USD)</label>
        <input style={{ ...inp, color: T.gold }} type="number" value={f.target} onChange={(e) => upd("target", e.target.value)} placeholder="5000.00" />
        <label style={lbl}>Nota / deadline (opcional)</label>
        <input style={inp} value={f.note} onChange={(e) => upd("note", e.target.value)} placeholder="ej. Para diciembre 2026" />
        <button style={submitBtn} onClick={submit}>Crear Meta 🎯</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function FinTrack() {
  const [view, setView]         = useState("dashboard");
  const [income, setIncome]     = useState(0);
  const [accounts, setAccounts] = useState(ACCS_DEF);
  const [cats, setCats]         = useState(CATS_DEF);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals]       = useState(GOALS_DEF);
  const [setup, setSetup]       = useState(false);
  const [modal, setModal]       = useState(null);
  const [loading, setLoading]   = useState(true);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Load storage
  useEffect(() => {
    loadAll().then((d) => {
      if (d.income    !== undefined) setIncome(d.income);
      if (d.accounts)  setAccounts(d.accounts);
      if (d.categories) setCats(d.categories);
      if (d.expenses)  setExpenses(d.expenses);
      if (d.goals)     setGoals(d.goals);
      if (d.setup)     setSetup(d.setup);
      setLoading(false);
    });
  }, []);

  const sv = {
    income:     (v) => { setIncome(v);   save("income", v);      },
    accounts:   (v) => { setAccounts(v); save("accounts", v);    },
    categories: (v) => { setCats(v);     save("categories", v);  },
    expenses:   (v) => { setExpenses(v); save("expenses", v);    },
    goals:      (v) => { setGoals(v);    save("goals", v);       },
  };

  if (loading) return (
    <div style={{ background: T.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.t2, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
      Cargando FinTrack…
    </div>
  );

  if (!setup || !income) return (
    <SetupWizard onDone={(d) => {
      sv.income(d.income); sv.accounts(d.accounts);
      sv.categories(d.categories); sv.goals(d.goals);
      setSetup(true); save("setup", true);
    }} />
  );

  // Computed
  const pi         = paydayInfo();
  const cycleExp   = expenses.filter((e) => new Date(e.date) >= pi.last);
  const totalSpent = cycleExp.filter((e) => e.catId !== "ahorro").reduce((s, e) => s + e.amount, 0);
  const totalSaved = cycleExp.filter((e) => e.catId === "ahorro").reduce((s, e) => s + e.amount, 0);
  const available  = income - totalSpent - totalSaved;

  const catChartData = cats.map((c) => ({
    icon: c.icon, name: c.name, color: c.color,
    budget:  +(income * c.pct / 100).toFixed(2),
    gastado: +cycleExp.filter((e) => e.catId === c.id).reduce((s, e) => s + e.amount, 0).toFixed(2),
  }));

  const pieData = cats
    .map((c) => ({ name: c.name, value: cycleExp.filter((e) => e.catId === c.id).reduce((s, e) => s + e.amount, 0), color: c.color }))
    .filter((d) => d.value > 0);

  const shared = {
    income, accounts, categories: cats, expenses, goals, pi,
    cycleExp, totalSpent, totalSaved, available, catChartData, pieData,
    setShowModal: setModal,
    setIncomeSave:     sv.income,
    setAccountsSave:   sv.accounts,
    setCategoriesSave: sv.categories,
    setExpensesSave:   sv.expenses,
    setGoalsSave:      sv.goals,
  };

  const nav = [
    { id: "dashboard",   label: "Dashboard",    Icon: LayoutDashboard },
    { id: "gastos",      label: "Gastos",        Icon: DollarSign      },
    { id: "cuentas",     label: "Cuentas",       Icon: CreditCard      },
    { id: "metas",       label: "Metas",         Icon: Target          },
    { id: "presupuesto", label: "Presupuesto",   Icon: BarChart2       },
  ];

  return (
    <div style={{ background: T.bg, height: "100vh", display: "flex", fontFamily: "'Outfit','Segoe UI',sans-serif", color: T.t1, overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        select option { background: ${T.card}; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 215, background: T.card, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 9, color: T.t3, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>FINTRACK · ERNESTO</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700, color: T.gold }}>{$f(available)}</div>
          <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>disponible este ciclo</div>
        </div>

        {/* Payday */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: T.t2 }}>Próximo pago</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: pi.until <= 5 ? T.red : pi.until <= 10 ? T.orange : T.green }}>
              {pi.until}d
            </span>
          </div>
          <div style={{ background: T.bg, borderRadius: 4, height: 5, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${T.blue},${pi.pct > 0.8 ? T.red : pi.pct > 0.6 ? T.orange : T.green})`, width: `${pi.pct * 100}%`, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontSize: 10, color: T.t3, marginTop: 5 }}>Día {pi.since} de {pi.total} del ciclo</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {nav.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setView(id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left", background: view === id ? "rgba(61,142,255,0.1)" : "transparent", color: view === id ? T.blue : T.t2, fontFamily: "inherit", fontSize: 13, fontWeight: view === id ? 600 : 400, borderLeft: `2px solid ${view === id ? T.blue : "transparent"}`, transition: "all 0.15s" }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </nav>

        {/* Quick add */}
        <div style={{ padding: "14px 12px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setModal("expense")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px", borderRadius: 8, border: `1px solid ${T.gold}55`, background: T.gold + "15", color: T.gold, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>
            <Plus size={14} /> Registrar gasto
          </button>
          <div style={{ fontSize: 9, color: T.t3, textAlign: "center", marginTop: 10 }}>Pago: cada día 13</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ maxWidth: 1100 }}>
          {view === "dashboard"   && <DashboardView  {...shared} />}
          {view === "gastos"      && <ExpensesView   {...shared} />}
          {view === "cuentas"     && <AccountsView   {...shared} />}
          {view === "metas"       && <GoalsView       {...shared} />}
          {view === "presupuesto" && <BudgetView      {...shared} />}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal === "expense" && <AddExpenseModal {...shared} onClose={() => setModal(null)} />}
      {modal === "account" && <AddAccountModal {...shared} onClose={() => setModal(null)} />}
      {modal === "goal"    && <AddGoalModal    {...shared} onClose={() => setModal(null)} />}
    </div>
  );
}
