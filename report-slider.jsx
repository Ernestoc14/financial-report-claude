import { useState } from "react";

const C = {
  bg: "#0d1117", surface: "#161b22", border: "#30363d",
  gold: "#d4a017", goldLight: "#f0c040",
  green: "#3fb950", red: "#f85149", blue: "#58a6ff",
  purple: "#bc8cff", orange: "#ffa657",
  txt: "#e6edf3", txt2: "#8b949e", txt3: "#484f58",
};

const income = { salary: 1500, hermano: 166, companero: 284, get total() { return 1500+166+284; } };

const expenses = [
  { name:"Alquiler",          amt:800,  cat:"fixed",    card:"efectivo",     icon:"🏠", note:null },
  { name:"Supermercado",      amt:200,  cat:"variable",  card:"visa",         icon:"🛒", note:"$80–$125 quincenal" },
  { name:"Gasolina",          amt:40,   cat:"variable",  card:"visa",         icon:"⛽", note:"$30–$50/mes" },
  { name:"Luz",               amt:60,   cat:"variable",  card:"yappy",        icon:"💡", note:"$40–$80/mes" },
  { name:"Gym",               amt:60,   cat:"fixed",    card:"visa",         icon:"💪", note:null },
  { name:"Internet",          amt:20,   cat:"fixed",    card:"amex",         icon:"📶", note:null },
  { name:"Data Celular",      amt:20,   cat:"fixed",    card:"amex",         icon:"📱", note:null },
  { name:"Agua",              amt:6,    cat:"fixed",    card:"yappy",        icon:"💧", note:null },
  { name:"Ahorro Navidad",    amt:108,  cat:"savings",  card:"transferencia",icon:"🎄", note:"$25/semana" },
  { name:"Emergency Fund",    amt:100,  cat:"savings",  card:"transferencia",icon:"🛡️", note:"Meta: $3,600" },
];

const BADGE = {
  visa:         { bg:"#1e3a5f", color:"#58a6ff", label:"VISA" },
  amex:         { bg:"#1a3a2a", color:"#3fb950", label:"AMEX" },
  yappy:        { bg:"#3a1a3a", color:"#bc8cff", label:"YAPPY" },
  efectivo:     { bg:"#3a2a1a", color:"#ffa657", label:"EFECTIVO" },
  transferencia:{ bg:"#2a3a1a", color:"#d4a017", label:"TRANSFER" },
};

const CAT = {
  fixed:    { color:"#58a6ff", label:"Gastos Fijos" },
  variable: { color:"#ffa657", label:"Gastos Variables" },
  savings:  { color:"#3fb950", label:"Ahorros" },
};

function Badge({ card }) {
  const b = BADGE[card];
  return <span style={{ background:b.bg, color:b.color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, letterSpacing:1, fontFamily:"monospace" }}>{b.label}</span>;
}

function Bar({ value, max, color }) {
  const pct = Math.min((value/max)*100, 100);
  const c = pct > 90 ? C.red : pct > 50 ? C.orange : color;
  return (
    <div>
      <div style={{ background:"#ffffff10", borderRadius:99, height:7, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", borderRadius:99, background:c, boxShadow:`0 0 8px ${c}88`, transition:"width 0.5s" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ color:C.txt3, fontSize:11 }}>${value} / ${max}</span>
        <span style={{ color: pct>50?C.orange:C.txt3, fontSize:11 }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function Budget() {
  const [tab, setTab] = useState("budget");
  const [visaUsed, setVisaUsed] = useState(140);
  const [amexUsed, setAmexUsed] = useState(40);

  const total = expenses.reduce((s,e)=>s+e.amt,0);
  const fixed = expenses.filter(e=>e.cat==="fixed").reduce((s,e)=>s+e.amt,0);
  const variable = expenses.filter(e=>e.cat==="variable").reduce((s,e)=>s+e.amt,0);
  const savings = expenses.filter(e=>e.cat==="savings").reduce((s,e)=>s+e.amt,0);
  const left = income.total - total;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.txt, fontFamily:"'Georgia',serif", padding:"20px 14px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom:20 }}>
          <h1 style={{ margin:"0 0 4px", fontSize:24, letterSpacing:-0.5 }}>Ernesto's Budget <span style={{ color:C.gold }}>2026</span></h1>
          <p style={{ margin:0, color:C.txt2, fontSize:13 }}>Estructura optimizada · Fixed / Variable / Savings · 4 formas de pago</p>
        </div>

        {/* Income row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {[
            { label:"Salario",    value:income.salary,                      icon:"💼", color:C.blue,   sub:"ingreso principal" },
            { label:"Alquileres", value:income.hermano+income.companero,    icon:"🏘️", color:C.purple, sub:"hermano + compañero" },
            { label:"Total Real", value:income.total,                        icon:"💰", color:C.gold,   sub:"presupuesto real", bold:true },
          ].map(c=>(
            <div key={c.label} style={{ background:C.surface, border:`1px solid ${c.bold?C.gold+"55":C.border}`, borderRadius:12, padding:"14px 16px", boxShadow:c.bold?`0 0 18px ${C.gold}22`:"none" }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{c.icon}</div>
              <div style={{ color:c.color, fontSize:22, fontWeight:700 }}>${c.value}</div>
              <div style={{ color:C.txt2, fontSize:12 }}>{c.label}</div>
              <div style={{ color:C.txt3, fontSize:11 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>
          {[["budget","📊 Presupuesto"],["cards","💳 Tarjetas"],["tips","💡 Consejos"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              background:"none", border:"none", cursor:"pointer", padding:"8px 14px",
              fontFamily:"inherit", fontSize:13,
              color: tab===id ? C.gold : C.txt2,
              borderBottom: tab===id ? `2px solid ${C.gold}` : "2px solid transparent",
              marginBottom:-1, fontWeight: tab===id ? 600 : 400,
            }}>{label}</button>
          ))}
        </div>

        {/* BUDGET TAB */}
        {tab==="budget" && (
          <div>
            {/* Summary */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:18 }}>
              {[
                { label:"Fijos",     v:fixed,    color:C.blue },
                { label:"Variables", v:variable, color:C.orange },
                { label:"Ahorros",   v:savings,  color:C.green },
                { label:"Margen",    v:left,     color:left>=0?C.gold:C.red },
              ].map(s=>(
                <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ color:s.color, fontSize:19, fontWeight:700 }}>${s.v}</div>
                  <div style={{ color:C.txt3, fontSize:11, marginTop:2 }}>{s.label}/mes</div>
                </div>
              ))}
            </div>

            {/* Alert: salary alone not enough */}
            <div style={{ background:"#f8514911", border:`1px solid ${C.red}33`, borderRadius:10, padding:"12px 16px", marginBottom:16, display:"flex", gap:10 }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <div>
                <div style={{ color:C.red, fontWeight:600, fontSize:13 }}>Solo con tu salario ($1,500) te faltan ${total-income.salary}</div>
                <div style={{ color:C.txt2, fontSize:12, marginTop:2 }}>Por eso debes sumar siempre los alquileres al presupuesto mensual. Tu ingreso real es $1,950.</div>
              </div>
            </div>

            {/* Expense list by category */}
            {["fixed","variable","savings"].map(cat=>{
              const items = expenses.filter(e=>e.cat===cat);
              const catTotal = items.reduce((s,e)=>s+e.amt,0);
              const cc = CAT[cat];
              return (
                <div key={cat}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, margin:"14px 0 8px" }}>
                    <span style={{ color:cc.color, fontWeight:700, fontSize:12, letterSpacing:0.5 }}>{cc.label}</span>
                    <div style={{ flex:1, height:1, background:C.border }} />
                    <span style={{ color:C.txt3, fontSize:12 }}>${catTotal}/mes</span>
                  </div>
                  {items.map(exp=>(
                    <div key={exp.name} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
                      <span style={{ fontSize:19, width:26, textAlign:"center" }}>{exp.icon}</span>
                      <div style={{ flex:1 }}>
                        <span style={{ fontWeight:600, fontSize:13 }}>{exp.name}</span>
                        {exp.note && <span style={{ color:C.txt3, fontSize:11, marginLeft:8 }}>{exp.note}</span>}
                      </div>
                      <Badge card={exp.card} />
                      <div style={{ textAlign:"right", minWidth:52 }}>
                        <div style={{ fontWeight:700, fontSize:14 }}>${exp.amt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Total */}
            <div style={{ background:`${C.gold}0d`, border:`1px solid ${C.gold}33`, borderRadius:12, padding:"16px", marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:C.txt2, fontSize:12 }}>Total presupuestado</div>
                <div style={{ color:C.gold, fontSize:22, fontWeight:700 }}>${total}/mes</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:C.txt2, fontSize:12 }}>Te queda libre</div>
                <div style={{ color:left>=0?C.green:C.red, fontSize:22, fontWeight:700 }}>{left>=0?"+":""}{left}</div>
                <div style={{ color:C.txt3, fontSize:11 }}>para gastos extra/diversión</div>
              </div>
            </div>
          </div>
        )}

        {/* CARDS TAB */}
        {tab==="cards" && (
          <div>
            <p style={{ color:C.txt2, fontSize:13, marginTop:0, marginBottom:18 }}>
              Simulador de utilización. Mueve el slider y ve si tu uso es saludable o riesgoso.
            </p>

            {/* Visa */}
            {[
              { name:"Visa Smartcash", limit:500, maxRec:150, used:visaUsed, setUsed:setVisaUsed,
                grad:"linear-gradient(135deg,#1a3a8a,#3b6dd1)", light:"#58a6ff",
                icon:"💳", uses:["Supermercado","Gasolina","Gym"],
                strategy:"Úsala para el día a día. Su cashback es tu mayor ventaja.",
                tip:"Paga el balance completo cada mes. Si solo pagas el mínimo, el cashback no vale nada frente al interés." },
              { name:"AMEX Connectmiles", limit:100, maxRec:30, used:amexUsed, setUsed:setAmexUsed,
                grad:"linear-gradient(135deg,#064e35,#0f9b6a)", light:"#3fb950",
                icon:"✈️", uses:["Internet","Data Celular"],
                strategy:"Solo para gastos fijos pequeños. Acumulas millas sin riesgo.",
                tip:"Con límite de $100, es fácil quedarse sin crédito disponible. Úsala con disciplina extrema." },
            ].map(card=>{
              const pct = (card.used/card.limit)*100;
              const statusColor = pct>70?C.red:pct>30?C.orange:C.green;
              const status = pct>70?"⚠️ Peligroso":pct>30?"⚡ Cuidado":"✅ Saludable";
              return (
                <div key={card.name} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
                  <div style={{ background:card.grad, borderRadius:12, padding:"14px 18px", marginBottom:14, display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:12, opacity:0.8 }}>{card.icon} {card.name}</div>
                      <div style={{ fontSize:22, fontWeight:700, marginTop:6 }}>${card.limit} límite</div>
                    </div>
                    <div style={{ textAlign:"right", alignSelf:"center" }}>
                      <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:8, padding:"4px 10px", fontSize:12 }}>
                        Máx recomendado: ${card.maxRec}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:13, color:C.txt2 }}>Uso mensual</span>
                      <span style={{ fontSize:13, fontWeight:700, color:statusColor }}>{status}</span>
                    </div>
                    <input type="range" min={0} max={card.limit} value={card.used}
                      onChange={e=>card.setUsed(Number(e.target.value))}
                      style={{ width:"100%", accentColor:statusColor, marginBottom:8 }} />
                    <Bar value={card.used} max={card.limit} color={card.light} />
                  </div>

                  <div style={{ background:C.bg, borderRadius:10, padding:"12px 14px", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:C.txt3, marginBottom:6 }}>IDEAL PARA</div>
                    <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                      {card.uses.map(u=>(
                        <span key={u} style={{ background:`${card.light}22`, color:card.light, fontSize:11, padding:"2px 10px", borderRadius:99, border:`1px solid ${card.light}33` }}>{u}</span>
                      ))}
                    </div>
                    <div style={{ fontSize:13, color:C.txt2, fontStyle:"italic" }}>💡 {card.tip}</div>
                  </div>
                </div>
              );
            })}

            {/* Yappy */}
            <div style={{ background:C.surface, border:`1px solid #bc8cff33`, borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:28 }}>📲</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:"#bc8cff" }}>Yappy</div>
                  <div style={{ color:C.txt2, fontSize:12 }}>Transferencias instantáneas</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["Agua","Luz","Pagos entre personas","Emergencias pequeñas"].map(u=>(
                  <span key={u} style={{ background:"#bc8cff22", color:"#bc8cff", fontSize:11, padding:"2px 10px", borderRadius:99, border:"1px solid #bc8cff33" }}>{u}</span>
                ))}
              </div>
              <div style={{ fontSize:12, color:C.txt2, marginTop:10, fontStyle:"italic" }}>
                💡 Ideal para pagos de servicios donde no aceptan tarjeta. No acumula rewards, úsala solo cuando sea necesario.
              </div>
            </div>

            {/* Rule reminder */}
            <div style={{ background:`${C.gold}0d`, border:`1px solid ${C.gold}33`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontWeight:700, color:C.gold, marginBottom:8 }}>📏 La Regla de Oro</div>
              <div style={{ color:C.txt2, fontSize:13, lineHeight:1.7 }}>
                Mantén la utilización <strong style={{color:C.gold}}>debajo del 30%</strong> en cada tarjeta.<br/>
                Visa: máx <strong style={{color:C.blue}}>$150/mes</strong> · AMEX: máx <strong style={{color:C.green}}>$30/mes</strong><br/>
                Paga el balance <strong style={{color:C.gold}}>completo</strong> antes de la fecha de corte. Nunca el mínimo.
              </div>
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {tab==="tips" && (
          <div>
            {/* Why running out */}
            <div style={{ background:C.surface, border:`1px solid ${C.red}33`, borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:22 }}>🚨</span>
                <h3 style={{ margin:0, fontSize:15, color:C.red }}>Por qué te quedas sin dinero</h3>
              </div>
              {[
                "Mentalmente presupuestas con $1,500 pero gastas como si tuvieras más — porque los $450 de alquiler llegan y los gastas sin trackear.",
                "Los gastos variables (super, luz, gasolina) se disparan y no hay buffer. Un mes de luz alta + super alto ya desequilibra todo.",
                "La tarjeta de crédito actúa como dinero extra en vez de ser una herramienta de cashback. El problema: hay que pagarla de todos modos.",
                "No hay emergency fund, entonces cualquier gasto inesperado se convierte en deuda.",
              ].map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:`${C.red}22`, color:C.red, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <span style={{ color:C.txt2, fontSize:13, lineHeight:1.6 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Fix */}
            <div style={{ background:C.surface, border:`1px solid ${C.green}33`, borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:22 }}>✅</span>
                <h3 style={{ margin:0, fontSize:15, color:C.green }}>El sistema que necesitas</h3>
              </div>
              {[
                "Día 1 del mes: cuando cobre, mueve inmediatamente los ahorros ($208) y reserva el pago de tarjetas. Lo que queda es lo que puedes gastar.",
                "Separa mentalmente los alquileres: $166+$284 = $450 que van primero al alquiler de la casa ($800). Te quedan $650 de bolsillo extra.",
                "Para gastos variables (super, luz, gas) usa un 'sobre virtual': asigna $300 fijo al mes y no te pases. Si ahorras de ese sobre, lo acumulas.",
                "Regla de los 3 días: si quieres comprar algo que no estaba en el presupuesto, espera 3 días. Si aún lo quieres y tienes el cash, lo compras.",
              ].map((t,i)=>(
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:`${C.green}22`, color:C.green, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <span style={{ color:C.txt2, fontSize:13, lineHeight:1.6 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Emergency Fund */}
            <div style={{ background:C.surface, border:`1px solid ${C.gold}33`, borderRadius:14, padding:18 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:22 }}>🛡️</span>
                <h3 style={{ margin:0, fontSize:15, color:C.gold }}>Proyección del Emergency Fund</h3>
              </div>
              <div style={{ color:C.txt3, fontSize:12, marginBottom:14 }}>Ahorrando $100/mes. Meta = 3 meses de gastos = $3,600</div>
              {[
                { label:"Mes 10", desc:"Primera meta: $1,000", v:1000, color:C.blue },
                { label:"Mes 22", desc:"Mitad del camino", v:2200, color:C.purple },
                { label:"Mes 36", desc:"Meta completa ✅", v:3600, color:C.green },
              ].map(m=>(
                <div key={m.label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:C.txt2 }}>{m.label} — {m.desc}</span>
                    <span style={{ fontSize:12, color:m.color, fontWeight:700 }}>${m.v}</span>
                  </div>
                  <Bar value={m.v} max={3600} color={m.color} />
                </div>
              ))}
              <div style={{ background:`${C.gold}0d`, borderRadius:10, padding:"10px 12px", marginTop:8, fontSize:12, color:C.txt2, border:`1px solid ${C.gold}22` }}>
                💡 <strong style={{color:C.gold}}>Hack:</strong> Si recibes tu décimo ($262) o algún bono, ponlo directo aquí. Llegarías a la primera meta en solo 4 meses.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}