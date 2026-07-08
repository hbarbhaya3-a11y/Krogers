// Store Service Risk — At-Risk Replenishment Orders
// 7-screen guided flow config. Derived from Signal 4 full-fidelity blueprint:
// Signal Analysis → Objectives & KPIs → Simulation Levers → Simulation Summary
// → Optimization Results → Approval & Execution → Learn & Save Scenario.
// Domain levers: MEIO rebalance, allocation resequencing, transportation
// reroute, selective expedited logistics. All levers default to `recommended`.

// ── Simulation levers (Screen 3) ────────────────────────────────────────────
// `recommended` is used as the default value of the page for every lever.
export const SSR_LEVERS = [
  {
    id: 'meioRebalance',
    label: 'MEIO Rebalance Aggressiveness',
    help: 'How hard to rebalance inventory across echelons to cover downstream risk.',
    type: 'segmented',
    options: ['Conservative', 'Balanced', 'Aggressive'],
    recommended: 'Balanced',
  },
  {
    id: 'allocationPriority',
    label: 'Allocation Resequencing Priority',
    help: 'Reorder replenishment queues toward service or toward cost.',
    type: 'segmented',
    options: ['Cost-first', 'Balanced', 'Service-first'],
    recommended: 'Service-first',
  },
  {
    id: 'rerouteScope',
    label: 'Transportation Reroute Scope',
    help: 'Share of at-risk lanes eligible for reroute / carrier swap.',
    type: 'slider', min: 0, max: 100, step: 5, unit: '%',
    recommended: 60,
  },
  {
    id: 'expediteCap',
    label: 'Selective Expedited Logistics (Premium Freight Cap)',
    help: 'Ceiling on at-risk loads allowed to use premium freight.',
    type: 'slider', min: 0, max: 40, step: 5, unit: '% of loads',
    recommended: 15,
  },
  {
    id: 'safetyStockUplift',
    label: 'Safety Stock Uplift (priority SKUs)',
    help: 'Temporary safety-stock increase for priority store/SKU pairs.',
    type: 'slider', min: 0, max: 30, step: 2, unit: '%',
    recommended: 12,
  },
  {
    id: 'serviceTarget',
    label: 'Service Attainment Target',
    help: 'Minimum service level the recovery plan must protect.',
    type: 'slider', min: 92, max: 99, step: 0.5, unit: '%',
    recommended: 97,
  },
  {
    id: 'recoveryWindow',
    label: 'Recovery Window',
    help: 'Time budget for the network to return to plan.',
    type: 'segmented',
    options: ['24 hr', '48 hr', '72 hr'],
    recommended: '48 hr',
  },
]

// Convenience: { leverId: recommendedValue } — the page's default lever state.
export const SSR_RECOMMENDED_DEFAULTS = Object.fromEntries(
  SSR_LEVERS.map(l => [l.id, l.recommended])
)

// ── KPIs (Screen 2) — baseline vs target ────────────────────────────────────
export const SSR_KPIS = [
  { id: 'serviceAttainment', label: 'Service attainment', baseline: 94.2, target: 97.0, unit: '%', dir: 'up' },
  { id: 'stockoutProb',      label: 'Stockout probability', baseline: 8.5, target: 3.0, unit: '%', dir: 'down' },
  { id: 'premiumFreight',    label: 'Premium freight cost', baseline: 1.42, target: 0.85, unit: '$M', dir: 'down' },
  { id: 'recoveryTime',      label: 'Recovery time', baseline: 72, target: 36, unit: 'hr', dir: 'down' },
  { id: 'storesAtRisk',      label: 'Stores at risk', baseline: 126, target: 18, unit: '', dir: 'down' },
]

// ── Objectives (Screen 2) ───────────────────────────────────────────────────
export const SSR_OBJECTIVES = [
  { id: 'protectService', label: 'Protect store service', desc: 'Hold priority stores above the service-attainment floor.', recommended: true },
  { id: 'cutStockout', label: 'Cut stockout probability', desc: 'Reduce downstream out-of-stock exposure on priority SKUs.', recommended: true },
  { id: 'limitPremium', label: 'Limit premium freight', desc: 'Cap expedited logistics spend during recovery.', recommended: true },
  { id: 'speedRecovery', label: 'Speed recovery', desc: 'Return the network to plan inside the recovery window.', recommended: false },
]

// ── Optimization plans (Screen 5) ───────────────────────────────────────────
// The Balanced plan is the recommended default selection.
export const SSR_PLANS = [
  {
    id: 'service-max', name: 'Service-Max', tone: 'orange',
    summary: 'Maximum service protection; higher premium-freight spend.',
    service: 98.1, stockout: 2.2, premium: 1.15, recovery: 30, recommended: false,
  },
  {
    id: 'balanced', name: 'Balanced', tone: 'green',
    summary: 'Best service-per-dollar; MEIO rebalance + selective expedite.',
    service: 97.2, stockout: 3.0, premium: 0.86, recovery: 36, recommended: true,
  },
  {
    id: 'cost-min', name: 'Cost-Min', tone: 'blue',
    summary: 'Lowest cost; slower recovery, thinner service margin.',
    service: 95.6, stockout: 4.8, premium: 0.52, recovery: 60, recommended: false,
  },
]

// ── Execution checklist (Screen 6) ──────────────────────────────────────────
export const SSR_EXECUTION_ITEMS = [
  { id: 'reroute', label: 'Reroute / carrier-swap orders issued to TMS', count: 41 },
  { id: 'transfer', label: 'Inter-echelon transfer orders staged (MEIO)', count: 63 },
  { id: 'expedite', label: 'Expedite authorizations within premium-freight cap', count: 19 },
  { id: 'allocation', label: 'Allocation resequencing pushed to OMS', count: 126 },
  { id: 'holdout', label: 'Holdout lanes preserved for causal measurement', count: 12 },
]

// ── Per-screen loading transition lines (new supply-chain context) ──────────
export const SSR_LOADING_LINES = {
  1: ['Ingesting OMS + inventory feeds…', 'Scoring store/SKU service risk…', 'Matching disruption precedents…', 'Signal analysis ready.'],
  2: ['Loading service KPIs…', 'Reading baseline vs target…', 'Preparing objectives…'],
  3: ['Loading simulation levers…', 'Applying recommended defaults…', 'Levers ready.'],
  4: ['Running recovery simulation…', 'Sampling demand + ETA uncertainty…', 'Comparing vs do-nothing baseline…', 'Summary ready.'],
  5: ['Optimizing recovery plans…', 'Ranking service-vs-cost trade-offs…', 'Selecting recommended plan…'],
  6: ['Assembling execution package…', 'Validating constraints + holdout…', 'Ready for approval.'],
  7: ['Capturing outcomes…', 'Writing to scenario library…', 'Learning recorded.'],
}
