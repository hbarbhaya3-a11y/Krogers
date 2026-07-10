// Store Service Risk — At-Risk Replenishment Orders
// Full-fidelity 7-screen guided flow content (Signal 1).
// Screens: Signal Analysis → Objectives & KPIs → Simulation Levers →
// Simulation Summary → Optimization Results → Approval & Execution →
// Learn & Save Scenario. All levers/objectives/KPIs default to `recommended`.
// Numeric KPIs are demo-ready illustrative values.

// ── Screen 1 — Signal Analysis ──────────────────────────────────────────────
export const SSR_SIGNAL = {
  sentinel: 'Store Service Sentinel',
  bannerText: 'Store Service Risk — at-risk replenishment orders detected across priority store/SKU combinations.',
  card: [
    { label: 'Signal class', value: 'Service risk / replenishment exception' },
    { label: 'Severity', value: 'HIGH' },
    { label: 'Confidence', value: '87%', note: 'demo value' },
    { label: 'Impacted scope', value: '126 stores / SKU-location combinations', note: 'demo value' },
    { label: 'Historical precedents', value: '5 matched episodes', note: 'demo value' },
    { label: 'Response window', value: '24–72 hr service protection window' },
  ],
  sourceChips: ['OMS', 'POS', 'INVENTORY LEDGER', 'WMS', 'TMS', 'DC INVENTORY CONTEXT'],
  detail: 'TwinX has detected rising service risk across priority store/SKU replenishment orders. Delayed inbound flow, low inventory cover, and compressed time-to-need indicate that the current replenishment plan may miss service targets if no intervention is taken.',
  conditions: [
    'Store inventory cover is below service threshold,',
    'Replenishment ETA is outside the required service window,',
    'Alternative inventory exists in the network but is not currently positioned to protect the at-risk stores.',
  ],
  conditionsNote: 'Store nodes in the MEIO model use demand, on-hand inventory, service risk, and space constraints as state variables, and stockout / replenishment need as events.',
}

export const SSR_PRECEDENTS = [
  { episode: 'Promo-driven replenishment spike', similarity: 91, action: 'Priority allocation + reroute', outcome: 'Service risk reduced; premium freight limited' },
  { episode: 'Supplier delay to high-volume DC', similarity: 86, action: 'MEIO rebalance + selective expedite', outcome: 'Downstream stockout risk reduced' },
  { episode: 'DC throughput constraint', similarity: 79, action: 'Capacity shift + order resequencing', outcome: 'Backlog reduced and urgent stores protected' },
]

export const SSR_HYPOTHESIS = 'If Kroger prioritizes at-risk store/SKU replenishment orders using a combined recovery plan — MEIO rebalance, priority reroute, allocation resequencing, and selective premium freight only for unrecoverable cases — then Kroger can improve service attainment while limiting premium freight and avoiding unnecessary inventory movement.'
export const SSR_INIT_RECO = {
  nextStep: 'Run Service Protection Replanning simulation.',
  path: 'At-risk replenishment orders → service-risk ranking → MEIO rebalance → reroute / resequence → selective expedite → planner approval',
}

// ── Screen 2 — Objectives & KPIs ────────────────────────────────────────────
export const SSR_PRIMARY_OBJECTIVES = [
  { value: 'Protect store service / in-stock', desc: 'Prioritize store availability and prevent service misses' },
  { value: 'Minimize premium freight', desc: 'Reduce expedite and premium freight exposure' },
  { value: 'Minimize total cost-to-serve', desc: 'Optimize logistics and replenishment cost' },
  { value: 'Maximize inventory efficiency', desc: 'Reduce excess safety stock / days inventory' },
  { value: 'Minimize waste / markdown', desc: 'Protect fresh and aging-sensitive inventory' },
  { value: 'Improve recovery time / TTR', desc: 'Reduce disruption recovery cycle time' },
]
export const SSR_PRIMARY_DEFAULT = 'Protect store service / in-stock'

export const SSR_SECONDARY_OBJECTIVES = [
  { value: 'Reduce premium freight exposure', desc: 'Avoid broad expedite response' },
  { value: 'Reduce stockout probability', desc: 'Minimize risk of store/SKU stockout' },
  { value: 'Minimize recovery time', desc: 'Protect service quickly' },
  { value: 'Preserve DC throughput', desc: 'Avoid creating new DC bottlenecks' },
  { value: 'Reduce waste / shrink', desc: 'Important for fresh categories' },
  { value: 'Reduce total network inventory', desc: 'MEIO capital objective' },
]
export const SSR_SECONDARY_DEFAULT = ['Reduce premium freight exposure', 'Reduce stockout probability']

export const SSR_KPI_OPTIONS = [
  { value: 'Service attainment under disruption', type: 'Primary service', rec: true },
  { value: 'Store in-stock rate', type: 'Primary store', rec: true },
  { value: 'Stockout probability', type: 'Risk', rec: true },
  { value: 'Premium freight spend', type: 'Cost', rec: true },
  { value: 'Recovery time / TTR', type: 'Resilience', rec: true },
  { value: 'Route feasibility', type: 'Feasibility', rec: true },
  { value: 'Transfer feasibility', type: 'Feasibility', rec: true },
  { value: 'Days inventory / safety stock', type: 'Inventory', rec: false },
  { value: 'Total network inventory', type: 'Capital', rec: false },
  { value: 'Shrink / waste %', type: 'Fresh', rec: false },
  { value: 'Replenishment exception closure time', type: 'Ops', rec: false },
]
export const SSR_KPI_DEFAULT = SSR_KPI_OPTIONS.filter(k => k.rec).map(k => k.value)

// ── Screen 3 — Simulation Levers (recommended = default) ────────────────────
// control: 'select' (options[]) | 'switch' (boolean). recommended seeds default.
export const SSR_LEVER_GROUPS = [
  {
    group: 'A', title: 'Service protection levers', color: 'orange',
    levers: [
      { id: 'priorityThreshold', label: 'Store priority threshold', control: 'select', options: ['Top 25% risk stores', 'Top 20% risk stores', 'Top 15% risk stores', 'Top 10% risk stores'], recommended: 'Top 15% risk stores', why: 'Focuses recovery on stores most likely to miss service' },
      { id: 'serviceTarget', label: 'Service target', control: 'select', options: ['96%', '97%', '98% for priority SKUs'], recommended: '98% for priority SKUs', why: 'Stress-tests higher service requirement' },
      { id: 'stockoutThreshold', label: 'Stockout risk threshold', control: 'select', options: ['>35% risk', '>30% risk', '>25% risk', '>20% risk'], recommended: '>25% risk', why: 'Pulls more stores into intervention scope' },
      { id: 'timeToNeed', label: 'Time-to-need window', control: 'select', options: ['72 hrs', '48 hrs', '24 hrs'], recommended: '48 hrs', why: 'Tightens urgency and prioritizes near-term risks' },
      { id: 'skuCriticality', label: 'SKU criticality', control: 'select', options: ['All impacted SKUs', 'High-volume + high-service SKUs'], recommended: 'High-volume + high-service SKUs', why: 'Avoids over-intervention on low-criticality SKUs' },
    ],
  },
  {
    group: 'B', title: 'MEIO / inventory levers', color: 'violet',
    levers: [
      { id: 'transfer', label: 'Transfer-on / transfer-off', control: 'switch', recommended: true, onLabel: 'Transfer-on', why: 'Tests whether available inventory elsewhere can protect stores' },
      { id: 'bufferPlacement', label: 'Upstream vs downstream buffer placement', control: 'select', options: ['Balanced', 'Shift 10–15% downstream (priority SKUs)', 'Shift upstream'], recommended: 'Shift 10–15% downstream (priority SKUs)', why: 'Tests whether moving inventory closer to stores protects service' },
      { id: 'safetyStock', label: 'Safety stock adjustment', control: 'select', options: ['Current policy', '+5% high-risk / -2% overstock', '+10% all nodes'], recommended: '+5% high-risk / -2% overstock', why: 'Protects service without inflating network-wide inventory' },
      { id: 'reorderPoint', label: 'Reorder point adjustment', control: 'select', options: ['Current reorder point', 'Raise for priority SKU/store pairs'], recommended: 'Raise for priority SKU/store pairs', why: 'Triggers earlier replenishment for at-risk combinations' },
      { id: 'transferViability', label: 'Transfer viability threshold', control: 'select', options: ['70% feasibility', '80% feasibility', '90% feasibility'], recommended: '80% feasibility', why: 'Avoids recommending transfers that cannot arrive in time' },
      { id: 'storeCapacity', label: 'Store capacity constraint', control: 'select', options: ['Editable', 'Locked (hard constraint)'], recommended: 'Locked (hard constraint)', why: 'Prevents infeasible downstream push' },
    ],
  },
  {
    group: 'C', title: 'Transportation / network levers', color: 'teal',
    levers: [
      { id: 'priorityReroute', label: 'Priority reroute', control: 'switch', recommended: true, onLabel: 'On', why: 'Tests rerouting of critical replenishment orders' },
      { id: 'alternateLane', label: 'Alternate lane eligibility', control: 'select', options: ['Existing routes only', 'Existing + pre-approved alternate lanes'], recommended: 'Existing + pre-approved alternate lanes', why: 'Expands feasible recovery routes without adding new corridors' },
      { id: 'carrierSwap', label: 'Carrier swap', control: 'switch', recommended: true, onLabel: 'On for at-risk loads', why: 'Uses carrier on-time probability and tender acceptance' },
      { id: 'premiumCap', label: 'Premium freight cap', control: 'select', options: ['No cap', 'Cap to top 10–15% critical orders', 'Cap to top 5% critical'], recommended: 'Cap to top 10–15% critical orders', why: 'Prevents broad expedite spend' },
      { id: 'consolidation', label: 'Consolidation rule', control: 'select', options: ['Current plan', 'Disable for urgent / enable non-urgent'], recommended: 'Disable for urgent / enable non-urgent', why: 'Protects service while preserving trailer utilization' },
      { id: 'windowStrictness', label: 'Service window strictness', control: 'select', options: ['Normal', 'Strict for priority stores'], recommended: 'Strict for priority stores', why: 'Filters routes that cannot protect target service' },
    ],
  },
  {
    group: 'D', title: 'Cost / resilience levers', color: 'blue',
    levers: [
      { id: 'freightGuardrail', label: 'Premium freight budget guardrail', control: 'select', options: ['Current budget', 'Keep below scenario cap'], recommended: 'Keep below scenario cap', why: 'Ensures service is not protected at unlimited cost' },
      { id: 'shortageProxy', label: 'Shortage proxy cost', control: 'select', options: ['Current proxy', 'Increase for priority SKUs'], recommended: 'Increase for priority SKUs', why: 'Makes stockout avoidance more important in optimization' },
      { id: 'transferCost', label: 'Transfer cost', control: 'select', options: ['Current cost', 'Use actual transfer cost'], recommended: 'Use actual transfer cost', why: 'Prevents uneconomic transfers' },
      { id: 'ttrTarget', label: 'TTR target', control: 'select', options: ['72 hrs', '48 hrs', '24 hrs'], recommended: '48 hrs', why: 'Prioritizes faster recovery' },
      { id: 'feasibilityMin', label: 'Feasibility score minimum', control: 'select', options: ['70%', '80%', '90%'], recommended: '80%', why: 'Filters weak recommendations' },
    ],
  },
]

export const SSR_ALL_LEVERS = SSR_LEVER_GROUPS.flatMap(g => g.levers)
export const SSR_LEVER_DEFAULTS = Object.fromEntries(SSR_ALL_LEVERS.map(l => [l.id, l.recommended]))

export const SSR_LEVER_SUMMARY = [
  'Prioritize top 15% service-risk stores',
  'Raise service target to 98% for priority SKUs',
  'Enable MEIO transfer/rebalance',
  'Shift 10–15% buffer downstream for priority SKUs',
  'Enable priority reroute for urgent replenishment orders',
  'Enable carrier swap for at-risk loads',
  'Cap premium freight to critical unrecoverable orders only',
  'Set TTR target to 48 hours',
  'Keep store capacity, service windows, carrier eligibility, and planner approval as hard constraints',
]

// ── Screen 4 — Simulation Summary ───────────────────────────────────────────
export const SSR_SCENARIO = {
  name: 'Service Protection Replanning',
  signal: 'Store Service Risk — At-Risk Replenishment Orders',
  objective: 'Protect store service / in-stock while reducing stockout probability and limiting premium freight.',
  method: 'Deterministic baseline + stochastic demand / lead-time / ETA uncertainty + optimization scenario comparison.',
}
export const SSR_SCOPE = [
  { item: 'Stores in scope', value: '126 at-risk stores', note: 'demo value' },
  { item: 'SKU families', value: '8 priority SKU families', note: 'demo value' },
  { item: 'DCs involved', value: 'In-scope servicing DCs' },
  { item: 'Time horizon', value: '72 hours' },
  { item: 'Iterations', value: '1,000', note: 'demo value' },
  { item: 'Baseline', value: 'Current replenishment plan' },
  { item: 'Comparison scenarios', value: 'Do nothing, reroute, MEIO rebalance, selective expedite, combined recovery' },
  { item: 'Hard constraints', value: 'Store capacity, service windows, route/transfer feasibility, carrier eligibility, planner approval' },
]
export const SSR_VARIANTS = [
  { scenario: 'Baseline / Do Nothing', desc: 'Current replenishment plan continues' },
  { scenario: 'Scenario 1 — MEIO Rebalance', desc: 'Move inventory from available upstream/alternate nodes' },
  { scenario: 'Scenario 2 — Priority Reroute', desc: 'Reroute at-risk replenishment orders through feasible alternate lanes' },
  { scenario: 'Scenario 3 — Selective Premium Freight', desc: 'Expedite only critical unrecoverable orders' },
  { scenario: 'Scenario 4 — Combined Recovery', desc: 'MEIO rebalance + priority reroute + selective expedite' },
]
export const SSR_VALIDATION = [
  'Store capacity constraint checked', 'DC inventory availability checked', 'Transfer feasibility checked',
  'Route feasibility checked', 'Carrier eligibility checked', 'Service windows checked',
  'Premium freight guardrail checked', 'Planner approval required before execution',
]

// ── Screen 5 — Simulation Results ───────────────────────────────────────────
export const SSR_BASELINE = [
  { kpi: 'Service attainment under disruption', value: '92.4%' },
  { kpi: 'Store in-stock rate for impacted SKUs', value: '91.8%' },
  { kpi: 'Stockout probability', value: '18.6%' },
  { kpi: 'Premium freight exposure', value: '$420K' },
  { kpi: 'Recovery time / TTR', value: '68 hrs' },
  { kpi: 'Route feasibility', value: '74%' },
  { kpi: 'Transfer feasibility', value: '71%' },
]
export const SSR_RECOMMENDATIONS = [
  {
    id: 'meio', rank: 2, tone: 'violet', recommended: false,
    cardTitle: 'Recommendation 1: Rebalance Available Inventory Before Expediting',
    trigger: 'Alternative inventory exists upstream but is not positioned to protect at-risk stores.',
    leversUsed: 'MEIO transfer/rebalance · allocation resequencing · reorder-point uplift for priority pairs',
    impacted: '~78 priority stores · 6 SKU families · 4 servicing DCs',
    confidence: '88% · ±3.2 pts service attainment',
    whyNot: 'Alone it does not fix lane-level ETA breaches, so pure transport-constrained stores stay exposed.',
    recommends: [
      'Move available inventory from upstream/alternate nodes to stores with highest stockout probability.',
      'Resequence allocation so constrained inventory goes first to priority store/SKU combinations.',
    ],
    kpi: [
      { k: 'Service attainment', b: '92.4%', a: '96.9%', d: '+4.5 pts' },
      { k: 'Store in-stock rate', b: '91.8%', a: '96.1%', d: '+4.3 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '9.8%', d: '-8.8 pts' },
      { k: 'Premium freight exposure', b: '$420K', a: '$285K', d: '-$135K' },
      { k: 'TTR', b: '68 hrs', a: '54 hrs', d: '-14 hrs' },
      { k: 'Transfer feasibility', b: '71%', a: '84%', d: '+13 pts' },
    ],
    why: 'MEIO is specifically intended to determine where inventory should be held and how much, so service targets can be achieved at the lowest viable inventory and carrying-cost posture.',
    bestWhen: 'Use when inventory exists in the network but is not positioned close enough to the at-risk stores.',
    risk: 'Do not approve if transfer cycle time exceeds time-to-need or store capacity is insufficient.',
    plan: {
      title: 'Service Protection Plan — MEIO Rebalance & Allocation Resequencing',
      objective: 'Protect at-risk store service by repositioning existing network inventory and resequencing allocation before any expedite.',
      phases: [
        { name: 'Phase 1 — Detect & rank (0–4 hr)', actions: ['Rank ~78 priority stores by stockout probability × time-to-need', 'Freeze allocation for priority SKU/store pairs pending replan'] },
        { name: 'Phase 2 — Rebalance (4–24 hr)', actions: ['Identify surplus on-hand at upstream / alternate nodes for the 6 SKU families', 'Generate transfer orders where transfer cycle time < time-to-need and feasibility ≥ 80%', 'Resequence constrained inventory so priority pairs are served first'] },
        { name: 'Phase 3 — Confirm & monitor (24–54 hr)', actions: ['Confirm receipts and refresh service-risk scores', 'Release non-priority allocation back to standard flow'] },
      ],
      changes: [
        { area: 'Inventory (MEIO)', change: 'Transfer / reallocate surplus from upstream & alternate DCs to at-risk stores; raise reorder point for priority pairs' },
        { area: 'Allocation (OMS)', change: 'Resequence constrained inventory so priority store/SKU combinations are served first' },
        { area: 'Safety stock', change: '+5% for high-risk stores; −2% at overstocked nodes' },
        { area: 'Transportation', change: 'No lane change; standard carriers retained' },
      ],
      guardrails: ['Store capacity hard constraint', 'Transfer feasibility ≥ 80%', 'No premium freight in this plan', 'Planner approval before execution'],
      expected: 'Service attainment 92.4% → 96.9%; stockout 18.6% → 9.8%; premium freight −$135K; TTR −14 hr.',
    },
  },
  {
    id: 'reroute', rank: 3, tone: 'teal', recommended: false,
    cardTitle: 'Recommendation 2: Reroute Critical Replenishment Orders',
    trigger: 'Replenishment ETAs breach the service window on constrained lanes.',
    leversUsed: 'Priority reroute · pre-approved alternate lanes · carrier swap for at-risk loads',
    impacted: '~64 priority stores · 27 at-risk loads · 9 lanes',
    confidence: '85% · ±3.6 pts service attainment',
    whyNot: 'Does not reposition inventory, so stores with no upstream cover remain at risk.',
    recommends: [
      'Reroute replenishment loads for priority stores through feasible alternate lanes and eligible carriers.',
      'Keep non-urgent replenishment on the current route plan.',
    ],
    kpi: [
      { k: 'Service attainment', b: '92.4%', a: '96.2%', d: '+3.8 pts' },
      { k: 'Store in-stock rate', b: '91.8%', a: '95.4%', d: '+3.6 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '11.7%', d: '-6.9 pts' },
      { k: 'Premium freight exposure', b: '$420K', a: '$330K', d: '-$90K' },
      { k: 'TTR', b: '68 hrs', a: '49 hrs', d: '-19 hrs' },
      { k: 'Route feasibility', b: '74%', a: '87%', d: '+13 pts' },
    ],
    why: 'The Network Flow & Resilience use case explicitly includes reroute simulation, lane optimization, scenario comparison, and recommended reroutes routed through approval workflows.',
    bestWhen: 'Use when replenishment can still arrive within the service window via a feasible alternate lane/carrier.',
    risk: 'Do not approve if alternate lane capacity is constrained or the reroute creates a downstream DC bottleneck.',
    plan: {
      title: 'Service Protection Plan — Priority Reroute',
      objective: 'Protect service by moving at-risk replenishment loads onto feasible alternate lanes / carriers within the service window.',
      phases: [
        { name: 'Phase 1 — Identify at-risk loads (0–3 hr)', actions: ['Flag 27 at-risk loads across 9 lanes breaching ETA', 'Screen pre-approved alternate lanes for feasibility'] },
        { name: 'Phase 2 — Reroute & swap (3–18 hr)', actions: ['Reroute priority loads to feasible alternate lanes', 'Swap carriers using on-time probability and tender acceptance', 'Keep non-urgent loads on the current route plan'] },
        { name: 'Phase 3 — Track (18–49 hr)', actions: ['Track revised ETAs vs service window', 'Escalate residual breaches to selective-expedite review'] },
      ],
      changes: [
        { area: 'Transportation (TMS)', change: 'Reroute at-risk loads to existing + pre-approved alternate lanes; carrier swap for at-risk loads' },
        { area: 'Consolidation', change: 'Disable consolidation for urgent orders; retain for non-urgent' },
        { area: 'Service windows', change: 'Strict enforcement for priority stores' },
        { area: 'Inventory', change: 'No repositioning; on-hand posture unchanged' },
      ],
      guardrails: ['No new corridors', 'Carrier eligibility', 'Alternate lane capacity check', 'Planner approval before execution'],
      expected: 'Service 92.4% → 96.2%; stockout −6.9 pts; route feasibility 74% → 87%; TTR −19 hr.',
    },
  },
  {
    id: 'combined', rank: 1, tone: 'green', recommended: true,
    cardTitle: 'Recommendation 3: Combined Service Protection Recovery',
    trigger: 'No single lever fully protects service without cost or feasibility trade-offs.',
    leversUsed: 'MEIO rebalance → priority reroute → selective premium freight (cap top 10–15% critical)',
    impacted: '126 priority stores · 8 SKU families · all servicing DCs · 9 lanes',
    confidence: '90% · ±2.4 pts service attainment',
    whyNot: 'Highest coordination cost and requires cross-functional approval vs single-lever plans.',
    recommends: [
      'Use MEIO rebalance first, priority reroute second, and premium freight only for critical unrecoverable store/SKU cases.',
      'Sequence actions so the lowest-cost recovery is exhausted before any expedite is triggered.',
    ],
    kpi: [
      { k: 'Service attainment', b: '92.4%', a: '98.1%', d: '+5.7 pts' },
      { k: 'Store in-stock rate', b: '91.8%', a: '97.6%', d: '+5.8 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '6.4%', d: '-12.2 pts' },
      { k: 'Premium freight exposure', b: '$420K', a: '$240K', d: '-$180K' },
      { k: 'TTR', b: '68 hrs', a: '42 hrs', d: '-26 hrs' },
      { k: 'Route feasibility', b: '74%', a: '86%', d: '+12 pts' },
      { k: 'Transfer feasibility', b: '71%', a: '83%', d: '+12 pts' },
    ],
    why: 'The combined path uses both mandatory demo themes — Network Flow & Resilience for reroute/replanning and MEIO for inventory rebalance across echelons — and recommends the best recovery plan to Planning.',
    bestWhen: 'Use when no single lever fully protects service without creating cost or feasibility trade-offs.',
    risk: 'Requires cross-functional approval because it changes inventory allocation, transport priority, and selective expedite decisions.',
    plan: {
      title: 'Service Protection Plan — Combined Recovery',
      objective: 'Protect service across all 126 at-risk stores using the lowest-cost recovery first, expediting only unrecoverable cases.',
      phases: [
        { name: 'Phase 1 — Rebalance first (0–24 hr)', actions: ['Run MEIO rebalance to reposition available inventory', 'Resequence allocation to priority store/SKU pairs'] },
        { name: 'Phase 2 — Reroute second (12–36 hr)', actions: ['Reroute remaining at-risk loads via feasible alternate lanes + carrier swap', 'Hold non-urgent loads on the current plan'] },
        { name: 'Phase 3 — Selective expedite (24–42 hr)', actions: ['Expedite only unrecoverable critical orders within the premium-freight cap (top 10–15%)'] },
        { name: 'Phase 4 — Confirm & learn', actions: ['Confirm service recovery and refresh risk scores', 'Log predicted vs actual KPI delta for learning'] },
      ],
      changes: [
        { area: 'Inventory (MEIO)', change: 'Cross-echelon rebalance + reorder-point uplift for priority pairs' },
        { area: 'Allocation (OMS)', change: 'Priority resequencing to at-risk store/SKU combinations' },
        { area: 'Transportation (TMS)', change: 'Priority reroute + carrier swap on constrained lanes' },
        { area: 'Premium freight', change: 'Selective expedite capped to top 10–15% unrecoverable orders only' },
        { area: 'Safety stock', change: '+5% high-risk stores; −2% overstocked nodes' },
      ],
      guardrails: ['Store capacity', 'Service windows', 'Route / transfer feasibility', 'Carrier eligibility', 'Premium-freight guardrail', 'Planner approval'],
      expected: 'Service 92.4% → 98.1%; stockout 18.6% → 6.4%; premium freight −$180K; TTR −26 hr.',
    },
  },
]
export const SSR_RANKING = [
  { rank: 1, reco: 'Combined Recovery', service: 'Highest', cost: 'High', speed: 'Highest', feasibility: 'Medium-high', select: 'Selected' },
  { rank: 2, reco: 'MEIO Rebalance + Allocation Resequencing', service: 'High', cost: 'High', speed: 'Medium', feasibility: 'High', select: 'Alternative' },
  { rank: 3, reco: 'Priority Reroute', service: 'Medium-high', cost: 'Medium-high', speed: 'High', feasibility: 'High', select: 'Alternative' },
]

// ── Screen 1 — Network Resilience visuals ───────────────────────────────────
export const SSR_DISRUPTION = {
  source: 'Supplier commitment shortfall + inbound ETA breach into high-volume DC-01',
  detected: '7/07/2026 · 06:12',
  cascade: 'Supplier → DC-01 inbound delay → dependent store replenishment lanes → downstream service risk',
}
export const SSR_IMPACT = [
  { label: 'Stores impacted', value: '126', color: 'orange' },
  { label: 'Revenue at risk', value: '$4.8M', color: 'red' },
  { label: 'Service degradation (72 hr)', value: '−6.4 pts', color: 'orange' },
  { label: 'Inventory at risk', value: '$2.1M', color: 'violet' },
  { label: 'Affected lanes', value: '9', color: 'blue' },
]
export const SSR_NETWORK = {
  nodes: [
    { id: 'S1', type: 'supplier', x: 4, y: 20, label: 'Supplier A' },
    { id: 'S2', type: 'supplier', x: 4, y: 55, label: 'Supplier B', impacted: true },
    { id: 'S3', type: 'supplier', x: 4, y: 88, label: 'Supplier C' },
    { id: 'DC1', type: 'dc', x: 48, y: 30, label: 'DC-01', impacted: true },
    { id: 'DC2', type: 'dc', x: 48, y: 72, label: 'DC-02' },
    { id: 'ST1', type: 'store', x: 92, y: 12, label: 'Cluster A' },
    { id: 'ST2', type: 'store', x: 92, y: 38, label: 'Cluster B', impacted: true },
    { id: 'ST3', type: 'store', x: 92, y: 64, label: 'Cluster C', impacted: true },
    { id: 'ST4', type: 'store', x: 92, y: 90, label: 'Cluster D' },
  ],
  before: [
    { from: 'S1', to: 'DC1', status: 'ok' }, { from: 'S2', to: 'DC1', status: 'at-risk' },
    { from: 'S3', to: 'DC2', status: 'ok' },
    { from: 'DC1', to: 'ST1', status: 'ok' }, { from: 'DC1', to: 'ST2', status: 'at-risk' },
    { from: 'DC1', to: 'ST3', status: 'at-risk' }, { from: 'DC2', to: 'ST3', status: 'ok' },
    { from: 'DC2', to: 'ST4', status: 'ok' },
  ],
  afterById: {
    combined: [
      { from: 'S1', to: 'DC1', status: 'rerouted' }, { from: 'S2', to: 'DC1', status: 'ok' },
      { from: 'S3', to: 'DC2', status: 'ok' },
      { from: 'DC1', to: 'ST1', status: 'ok' }, { from: 'DC2', to: 'ST2', status: 'rerouted' },
      { from: 'DC2', to: 'ST3', status: 'rerouted' }, { from: 'DC1', to: 'ST3', status: 'ok' },
      { from: 'DC2', to: 'ST4', status: 'ok' },
    ],
    meio: [
      { from: 'S1', to: 'DC1', status: 'ok' }, { from: 'S2', to: 'DC1', status: 'ok' },
      { from: 'S3', to: 'DC2', status: 'ok' },
      { from: 'DC1', to: 'ST1', status: 'ok' }, { from: 'DC2', to: 'ST2', status: 'rerouted' },
      { from: 'DC2', to: 'ST3', status: 'rerouted' }, { from: 'DC2', to: 'ST4', status: 'ok' },
    ],
    reroute: [
      { from: 'S1', to: 'DC1', status: 'rerouted' }, { from: 'S2', to: 'DC1', status: 'ok' },
      { from: 'S3', to: 'DC2', status: 'ok' },
      { from: 'DC1', to: 'ST1', status: 'ok' }, { from: 'DC1', to: 'ST2', status: 'rerouted' },
      { from: 'DC1', to: 'ST3', status: 'rerouted' }, { from: 'DC2', to: 'ST4', status: 'ok' },
    ],
  },
}
// Efficient frontier — x: premium-freight cost ($K), y: service %, z: recovery hr
export const SSR_FRONTIER = {
  xLabel: 'Premium freight cost ($K)', yLabel: 'Service attainment (%)', zLabel: 'Recovery time (hr)',
  points: [
    { x: 420, y: 92.4, z: 96, label: 'Do nothing', tone: 'gray' },
    { x: 285, y: 96.9, z: 54, label: 'MEIO Rebalance', tone: 'violet' },
    { x: 330, y: 96.2, z: 49, label: 'Priority Reroute', tone: 'teal' },
    { x: 240, y: 98.1, z: 42, label: 'Combined Recovery', tone: 'green', recommended: true },
  ],
}
// Exact actions by execution workflow, per recommendation id
export const SSR_WORKFLOW_ACTIONS = {
  meio: {
    WMS: ['Stage 63 inter-echelon transfer orders', 'Confirm DC dock / put-away capacity for inbound transfers'],
    OMS: ['Resequence 126 priority store/SKU replenishment orders'],
    APS: ['Recompute service-risk ranking', 'Apply +5% high-risk / −2% overstock safety stock'],
  },
  reroute: {
    TMS: ['Reroute 27 at-risk loads to pre-approved alternate lanes', 'Carrier swap on 19 loads by tender acceptance'],
    OMS: ['Hold non-urgent loads on current route plan'],
    APS: ['Refresh ETA + service-window feasibility'],
  },
  combined: {
    WMS: ['Stage 63 inter-echelon transfer orders (MEIO)', 'Confirm dock / put-away capacity'],
    OMS: ['Resequence 126 priority replenishment orders', 'Raise reorder points 5–7% for priority pairs'],
    TMS: ['Reroute 41 at-risk loads via alternate lanes', 'Carrier swap on 19 loads', 'Cap premium freight to top 10–15%'],
    APS: ['Recompute service-risk ranking + safety-stock uplift', 'Publish revised replenishment plan to planners'],
  },
}
// Screen 7 — Learn extensions
export const SSR_LEARN = {
  accuracy: [
    { label: 'Overall prediction accuracy', value: '93%' },
    { label: 'Service attainment', value: '±0.7 pts' },
    { label: 'Recovery time', value: '±3 hr' },
    { label: 'Premium freight', value: '±$18K' },
  ],
  recalibration: [
    { label: 'Stockout-risk model', before: 'w=0.62', after: 'w=0.71', delta: '+time-to-need', note: 'Higher weight on time-to-need compression' },
    { label: 'Transfer cycle-time prior', before: '46 hr', after: '49 hr', delta: '+3 hr', note: 'Two clusters ran longer than simulated' },
    { label: 'Reroute feasibility model', before: '0.84', after: '0.88', delta: '+0.04', note: 'Outperformed simulation on 2 lanes' },
  ],
  patterns: [
    'Supplier-B shortfalls consistently precede DC-01 inbound ETA breaches by ~36 hr.',
    'Cluster-B/C service risk co-moves — a shared reroute covers both.',
    'Premium freight is only needed for <15% of unrecoverable orders once MEIO runs first.',
  ],
  twin: { nodesEnriched: 126, lanesEnriched: 9, before: '76%', after: '90%', note: 'Store/lane digital twins updated with realized recovery outcomes' },
}

// ── Screen 6 — Approval & Execution ─────────────────────────────────────────
export const SSR_APPROVAL = {
  selected: 'Combined Service Protection Recovery',
  action: 'MEIO rebalance + priority reroute + selective premium freight for unrecoverable cases only',
  summary: [
    { field: 'Decision owner', value: 'Planning lead / supply chain planner' },
    { field: 'Approval type', value: 'Human approval required' },
    { field: 'Auto-execution', value: 'Disabled for Wave 1' },
    { field: 'Audit status', value: 'Decision log will be created' },
  ],
  execItems: [
    { item: 'Inventory rebalance list', target: 'Inventory / replenishment planning', action: 'Transfer or reallocate available inventory to priority stores' },
    { item: 'Priority replenishment list', target: 'OMS / planning queue', action: 'Resequence constrained replenishment orders' },
    { item: 'Reroute candidate list', target: 'TMS / transportation planning', action: 'Move at-risk orders to feasible alternate lanes/carriers' },
    { item: 'Selective expedite list', target: 'Logistics exception queue', action: 'Expedite only unrecoverable high-risk orders' },
    { item: 'Constraint checks', target: 'Approval pack', action: 'Show service window, transfer/route feasibility, store capacity' },
    { item: 'Expected KPI delta', target: 'Decision log', action: 'Store predicted KPI improvement before execution' },
  ],
  rationale: 'This option delivers the highest service protection while avoiding broad premium freight. It uses network inventory first, reroutes critical replenishment second, and applies expedite only where service cannot otherwise be protected.',
  constraints: ['Store capacity', 'Service window', 'DC inventory availability', 'Transfer feasibility', 'Route feasibility', 'Carrier eligibility', 'Premium freight guardrail', 'Planner approval'],
}

// ── Screen 7 — Learn & Save ─────────────────────────────────────────────────
export const SSR_OUTCOMES = [
  { metric: 'Service attainment', pred: '98.1%', actual: '97.4%', learn: 'Prediction slightly optimistic' },
  { metric: 'Store in-stock rate', pred: '97.6%', actual: '97.1%', learn: 'Within acceptable variance' },
  { metric: 'Stockout probability', pred: '6.4%', actual: '7.2%', learn: 'Recalibrate stockout risk' },
  { metric: 'Premium freight exposure', pred: '$240K', actual: '$258K', learn: 'Expedite need slightly higher' },
  { metric: 'TTR', pred: '42 hrs', actual: '45 hrs', learn: 'Update recovery-time prior' },
  { metric: 'Transfer feasibility', pred: '83%', actual: '80%', learn: 'Update transfer cycle-time assumption' },
  { metric: 'Route feasibility', pred: '86%', actual: '88%', learn: 'Reroute model performed better than expected' },
]
export const SSR_INSIGHTS = [
  'Transfer cycle time was slightly longer than expected for selected store clusters.',
  'Reroute feasibility performed better than simulated for two priority lanes.',
  'Premium freight was still required for a small subset of unrecoverable orders.',
  'Stockout-risk model should increase weight on time-to-need compression.',
  'Store service-risk threshold should remain at 25% for future similar events.',
]
export const SSR_SAVE = {
  name: 'Store Service Protection — Combined Recovery',
  tags: ['SERVICE RISK', 'REPLENISHMENT', 'MEIO REBALANCE', 'PRIORITY REROUTE', 'SELECTIVE EXPEDITE', 'SUPPLIER / DC / STORE FLOW'],
  reusableFor: [
    'supplier delay affecting store replenishment',
    'DC backlog creating downstream service risk',
    'promo-driven demand spike',
    'lead-time degradation',
    'low inventory cover at priority stores',
  ],
}

// ── Per-screen loading transition lines ─────────────────────────────────────
export const SSR_LOADING_LINES = {
  1: ['Ingesting OMS · POS · inventory ledger…', 'Scoring store/SKU service risk…', 'Matching disruption precedents…', 'Signal analysis ready.'],
  2: ['Loading objective framework…', 'Aligning KPIs to Store & DC Replenishment…', 'Objectives ready.'],
  3: ['Loading simulation levers…', 'Applying recommended configuration…', 'Levers ready.'],
  4: ['Assembling scenario setup…', 'Running pre-run validation checks…', 'Summary ready.'],
  5: ['Running deterministic + stochastic simulation…', 'Comparing recovery scenarios vs baseline…', 'Ranking recommendations…'],
  6: ['Assembling execution package…', 'Validating constraints + guardrails…', 'Ready for planner approval.'],
  7: ['Capturing realized outcomes…', 'Comparing predicted vs actual…', 'Updating priors + scenario library…'],
}
