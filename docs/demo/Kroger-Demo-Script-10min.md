# TwinX Supply OS — 10-Minute Demo Script
### Kroger Supply Chain Resilience · for senior supply chain stakeholders

**Audience:** VP Supply Chain, DC Operations, Planning & Replenishment, Transportation, Supply Chain Finance
**Goal:** Show TwinX Supply OS turning a live disruption signal into a simulated, optimized, approved, and learned recovery decision — across **Network Resilience (UC1)** and **MEIO Inventory (UC2)**.
**Format:** Live click-through. Two use cases. One narrative spine: **Sense → Simulate → Optimize → Approve → Learn.**

**Setup before you present**
- App open on the landing page (**Supply Chain Resilience Signals for Kroger's Network**).
- Signal list on the left; **Store Service Risk** is signal #1, **Inventory Imbalance** is signal #2.
- Have this line ready as your through-line: *"Same operating system, two of Kroger's biggest supply-chain money problems."*

---

## 0:00–1:00 · Opening — the problem (talk only)

> "Kroger runs a supplier → DC → store network where inventory is almost always *in the network* — just not in the *right echelon* at the right time. Today that's managed node-by-node, in silos, after the fact. The cost shows up as **service misses in stores**, **premium freight**, and **hundreds of millions in trapped working capital**.
>
> TwinX Supply OS is a decision layer on top of your existing TMS, WMS, OMS, and APS. It **senses** disruption, **simulates** recovery options, **optimizes** the trade-offs, routes a **planner-approved** decision to execution, and **learns** from what actually happened. Let me show you two live scenarios."

**Point at the left rail:** "Five live signals right now. Each is a real money moment. We'll go deep on two."

---

## 1:00–2:00 · Sense — the live signal board

**Do:** Hover the signal cards. Click **Store Service Risk — At-Risk Replenishment Orders** (top of the list).

**Say:**
> "Every card is a scored, sourced signal — not a dashboard alert. This one: **126 stores at risk**, HIGH severity, **87% confidence**, sourced from OMS, POS, inventory ledger, WMS, and TMS. Response window is 24–72 hours. Notice it maps 1:1 to a runnable recovery scenario."

**Do:** Click **Run scenario** → the mode modal appears → **Launch Guided Mode**.

**Say:** "Guided mode walks a planner through the decision with full explainability. Autopilot exists for pre-authorized, low-risk moves — but fiduciary-sensitive supply decisions stay planner-approved."

---

## 2:00–5:30 · UC1 — Network Resilience (Store Service Risk)

*Seven steps. Move briskly; linger on Signal, Optimization, and Strategy Details.*

### Screen 1 — Signal Analysis (45s)
**Say, pointing at the visuals:**
> "First, **what broke and what it costs**. The disruption source: a **supplier commitment shortfall + inbound ETA breach into high-volume DC-01**. The business impact is quantified up front — **126 stores impacted, $4.8M revenue at risk, −6.4 points of service degradation over 72 hours, $2.1M inventory at risk, 9 affected lanes**.
>
> This network map is the point: TwinX sees the **cascade** — supplier → DC-01 → dependent store clusters. Red nodes are impacted, dashed orange lines are at-risk lanes. This is a *network* view, not a node view."

**Do:** Click **Continue to Objectives**.

### Screen 2 — Objectives & KPIs (25s)
> "The planner sets the objective — **protect store service** — with premium-freight and stockout as secondary. KPIs are pre-selected to the recommended set: service attainment, in-stock, stockout probability, premium freight, recovery time, route and transfer feasibility. TwinX aligns the whole simulation to this."

**Do:** Continue to **Simulation Levers**.

### Screen 3 — Simulation Levers (30s)
> "Here's the control surface — MEIO rebalance, allocation resequencing, transportation reroute, selective expedite, safety-stock, service target, recovery window. **Every lever is pre-set to its recommended value** so a planner can run the recommended play in one click, or explore. Nothing is a black box."

**Do:** Click **Run Simulation** → let the transition play → **See Optimization Results**.

### Screen 5 — Optimization Results (60s) — *the money screen*
> "TwinX simulated the options against a **do-nothing baseline** and ranked three recovery plans:
> - **MEIO Rebalance** — reposition inventory before spending on freight,
> - **Priority Reroute** — move at-risk loads to feasible lanes,
> - **Combined Recovery** — the recommended plan.
>
> Combined takes service from **92.4% → 98.1%**, cuts stockout probability **18.6% → 6.4%**, *reduces* premium freight by **$180K**, and cuts recovery time from **68 to 42 hours**. Better service **and** lower cost — because we use inventory first and expedite only what's truly unrecoverable."

**Do:** On the recommended card, click **View strategy details**. Scroll the modal.

**Say (this is the differentiator — spend 30–40s here):**
> "This is what a planner actually needs to trust and execute a plan:
> - **Network flows, before vs after** — you can *see* the reroute and rebalance.
> - An **efficient frontier** of Service vs Cost vs Recovery Time — every option, trade-off explicit, recommended one starred.
> - And **exact actions by system** — WMS transfer orders, OMS resequencing, TMS reroutes and carrier swaps, APS safety-stock updates. This is execution-ready, not a slideware recommendation. And it **downloads** as a plan."

**Do:** **Download** (show the file drops), then **Close**. Continue to **Approval**.

### Screen 6 — Approval & Execution (25s)
> "Human approval gate. The planner sees the constraint checklist — store capacity, service windows, feasibility, carrier eligibility, premium-freight guardrail — all honored. Approve, and the action packets flow to TMS/WMS/OMS with a decision log created. Auto-execution stays off in Wave 1."

**Do:** Click **Approve & Send to Execution** → Continue to **Learn**.

### Screen 7 — Learn (30s)
> "This is what makes it compound. TwinX compares **predicted vs actual** — **93% prediction accuracy** here — then **recalibrates the models**, surfaces **discovered risk patterns** (for example: Supplier-B shortfalls precede DC-01 breaches by ~36 hours), and **evolves the digital twins** of every store and lane. The next similar disruption is predicted and recovered faster."

**Do:** Click **Exit Guided Flow** (returns home).

**Transition line:**
> "That was a *reactive* recovery. The second use case is the *structural* problem underneath it — where inventory lives."

---

## 5:30–9:00 · UC2 — MEIO (Inventory Imbalance)

**Do:** On the landing board, click **Inventory Imbalance — Excess Upstream, Shortage Downstream** → **Run scenario** → **Launch Guided Mode**.

### Screen 1 — Signal Analysis (60s) — *the "aha" for finance*
**Say, pointing at the heatmap:**
> "Same operating system, different problem. TwinX detects that inventory **exists** — it's just in the wrong echelon. This **heatmap** says it in one glance: **orange is excess upstream at supplier and DCs; blue is shortage at the stores**. The inventory-location bars show DC-01 and DC-02 sitting *above* policy while store clusters run *below*.
>
> The headline for this room: **$1.8M trapped capital, +14% excess upstream, 18.6% store service risk, $2.1M stockout exposure** — all at the same time. We're paying to carry inventory *and* missing service."

**Do:** Continue through **Objectives & KPIs** → **Simulation Levers**.

### Screens 2–3 — Objectives & MEIO Levers (30s)
> "Objective: **optimize placement while protecting service** — with reduce-duplicated-buffers, carrying-cost, and stockout as secondary. The lever set is the full MEIO toolkit across five groups — safety-stock right-sizing, cross-echelon de-duplication, reorder policy, uncertainty stress, and **finance-approved guardrails**. All defaulted to recommended."

**Do:** **Run Simulation** → **See Optimization Results**.

### Screen 5 — Optimization Results + Strategy Details (75s) — *the money screen*
> "The recommended **Balanced MEIO policy bundle** delivers on both axes at once: service **94.1% → 98.0%**, network inventory **down $140M**, **$140M working-capital release**, and buffer duplication **1.34 → 1.08**."

**Do:** Click **View strategy details** on the Balanced card. Scroll.

**Say (30–40s on the visuals):**
> "For a supply-chain leader this is the decision cockpit:
> - **Inventory movement, before vs after** — you see stock physically shift from over-buffered DCs down to at-risk stores.
> - The **efficient frontier of Service vs Inventory vs Working Capital** — the classic three-way trade-off, made explicit.
> - And a **head-to-head strategy comparison**: Safety-Stock, Rebalance, Capital, and Balanced — scored on service, inventory, capital release, feasibility, implementation effort, and confidence. If Finance wants max cash, that's the **Capital** strategy — $160M release. If we want the best all-round, it's **Balanced**. The trade-off is quantified, not argued."

**Do:** **Download** the plan → **Close** → Continue to **Approval**.

### Screen 6 — Approval (20s)
> "This one requires **planner *and* finance** sign-off, because it moves working capital. Carrying-cost and cash-release impacts are shown separately for auditability. Decision log created."

**Do:** **Approve & Send to Execution** → Continue to **Learn**.

### Screen 7 — Learn (25s)
> "And it learns at the *policy* level: it updates **demand models, lead-time models, safety-stock policies, transfer rules, and optimization parameters** from what actually happened. Your MEIO policy gets smarter every cycle instead of drifting stale."

**Do:** **Exit Guided Flow**.

---

## 9:00–10:00 · Close — value & next steps (talk only)

> "In ten minutes you saw one operating system solve two of Kroger's hardest problems:
> - **UC1 Network Resilience** — protect store service during disruption while *cutting* premium freight.
> - **UC2 MEIO** — release **$140M+** in working capital while *raising* service.
>
> Three things make this different from a planning tool:
> 1. **It's a decision layer, not a rip-and-replace** — it orchestrates your existing TMS, WMS, OMS, APS.
> 2. **Every recommendation is explainable and execution-ready** — network view, efficient frontier, exact system actions, planner-approved, fully logged.
> 3. **It compounds** — predicted-vs-actual learning recalibrates the models and evolves the digital twins every run.
>
> **Proposed next step:** a scoped Wave 1 on a handful of DCs and priority SKU families — recommendation-led, planner-approved, measured against a holdout so we can prove causal value before we scale."

---

## Appendix — presenter cheatsheet

| | UC1 Network Resilience | UC2 MEIO |
|---|---|---|
| **Signal** | Store Service Risk (126 stores, $4.8M rev at risk) | Inventory Imbalance ($1.8M trapped capital) |
| **Hero visual** | Supplier→DC→store network map + before/after flows | Imbalance heatmap + inventory movement |
| **Trade-off frontier** | Service vs Cost vs Recovery Time | Service vs Inventory vs Working Capital |
| **Recommended result** | Service 92.4%→98.1%, freight −$180K, TTR 68→42h | Service 94.1%→98.0%, inventory −$140M, $140M released |
| **Approval** | Planner | Planner + Finance |
| **Execution** | WMS/OMS/TMS/APS action packets | Safety-stock, reorder, transfer, placement |

**Likely questions & one-line answers**
- *"Are these real numbers?"* — "Demo-calibrated to the source KPI framework; the pipeline is real, the values plug into live Kroger feeds."
- *"Does it auto-execute?"* — "Not in Wave 1. Recommendation-led, planner-approved, everything logged."
- *"How do we know it works?"* — "Always-on holdout lanes/nodes — causal measurement, not correlation, on every deployed decision."
- *"What does it touch?"* — "It reads your feeds and writes action packets to existing systems — no ERP/WMS master-data redesign in Wave 1."

**Timing guardrail:** if you're running long, cut the UC1 Objectives/Levers narration and the UC2 Objectives narration — the Signal and Optimization/Strategy screens carry the story.
