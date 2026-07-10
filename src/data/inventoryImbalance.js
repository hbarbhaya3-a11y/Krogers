// Inventory Imbalance — Excess Upstream, Shortage Downstream (MEIO, Signal 2)
// Full-fidelity 7-screen guided flow: Signal Analysis → Objectives & KPIs →
// Simulation Levers → Simulation Summary → Optimization Results →
// Approval & Execution → Learn & Save. All levers/objectives/KPIs default to
// `recommended`. Numeric values are demo-ready illustrative figures.

// ── Screen 1 — Signal Analysis ──────────────────────────────────────────────
export const II_SIGNAL = {
  sentinel: 'MEIO Sentinel',
  bannerText: 'Inventory Imbalance detected across supplier → DC → store echelons.',
  card: [
    { label: 'Signal name', value: 'Inventory Imbalance — Excess Upstream, Shortage Downstream' },
    { label: 'Signal class', value: 'MEIO / inventory posture risk' },
    { label: 'Severity', value: 'MEDIUM-HIGH' },
    { label: 'Confidence', value: '89%', note: 'demo value' },
    { label: 'Impacted scope', value: '8 SKU families / 126 store-SKU combinations', note: 'demo value' },
    { label: 'Historical precedents', value: '4 matched inventory imbalance episodes', note: 'demo value' },
    { label: 'Response window', value: '48–72 hr rebalance window' },
  ],
  sourceChips: ['ERP', 'APS / PLANNING', 'WMS', 'INVENTORY LEDGER', 'SUPPLIER LEAD-TIME FEED'],
  detail: 'TwinX has detected inventory imbalance across the supplier → DC → store network. Current inventory is available in the network, but not in the right echelon or location to protect store-level service. Upstream and DC inventory buffers are above policy target for selected SKU families, while downstream store nodes show rising stockout probability and low days of supply. Kroger may be carrying excess working capital while still facing store service risk.',
  detailNote: 'Aligns with the MEIO problem statement: excess inventory in the wrong echelons plus store stockouts, caused by siloed node-level planning rather than coordinated network optimization.',
}

export const II_INDICATORS = [
  { indicator: 'Upstream inventory above policy', value: '+14%', interp: 'Too much inventory held before demand point' },
  { indicator: 'Downstream days of supply', value: '2.1 days', interp: 'Selected stores below service comfort band' },
  { indicator: 'Store stockout probability', value: '18.6%', interp: 'Elevated risk for priority SKU/store combinations' },
  { indicator: 'Buffer duplication index', value: '1.34', interp: 'Duplicate safety stock across echelons' },
  { indicator: 'Transfer viability score', value: '76%', interp: 'Rebalance is feasible but time-sensitive' },
  { indicator: 'Carrying-cost exposure', value: '$1.8M', interp: 'Capital / carrying-cost opportunity in current posture' },
]

export const II_PRECEDENTS = [
  { episode: 'Upstream-heavy inventory policy', similarity: 88, action: 'Shifted selected buffers downstream', outcome: 'Improved in-stock with lower duplicated safety stock' },
  { episode: 'Lead-time variance spike', similarity: 83, action: 'Increased target stock near demand nodes', outcome: 'Reduced stockout risk for volatile SKUs' },
  { episode: 'Slow-mover buildup in DCs', similarity: 79, action: 'SKU-location rationalization', outcome: 'Reduced excess inventory and slow-mover exposure' },
  { episode: 'Transfer-on policy test', similarity: 76, action: 'Enabled cross-node rebalance', outcome: 'Improved service without broad expedite' },
]

export const II_HYPOTHESIS = 'If Kroger shifts selected safety stock and target stock from over-buffered upstream/DC nodes toward high-risk downstream store/SKU locations — while preserving MOQ, space, transfer feasibility, and service-target constraints — then Kroger can improve in-stock performance and reduce duplicated network inventory without increasing total inventory.'
export const II_INIT_RECO = {
  nextStep: 'Run MEIO Rebalance Simulation.',
  path: 'Inventory imbalance → service/capital trade-off → buffer placement optimization → transfer/rebalance candidates → planner approval',
}

// ── Screen 2 — Objectives & KPIs ────────────────────────────────────────────
export const II_PRIMARY_OBJECTIVES = [
  { value: 'Optimize inventory placement while protecting service', desc: 'Determine where to hold inventory and how much across supplier, DC, and store echelons' },
  { value: 'Maximize service attainment / in-stock', desc: 'Prioritize downstream service above capital reduction' },
  { value: 'Minimize total network inventory', desc: 'Reduce overall inventory regardless of service trade-off' },
  { value: 'Minimize carrying cost', desc: 'Reduce recurring inventory carrying cost' },
  { value: 'Maximize working-capital release', desc: 'Prioritize cash release from inventory reduction' },
  { value: 'Reduce slow-mover buildup', desc: 'Focus on SKU-location rationalization' },
  { value: 'Maintain resilience under uncertainty', desc: 'Optimize inventory posture against demand/lead-time shocks' },
]
export const II_PRIMARY_DEFAULT = 'Optimize inventory placement while protecting service'

export const II_SECONDARY_OBJECTIVES = [
  { value: 'Reduce duplicated buffers across echelons', desc: 'Remove overlapping safety stock held at multiple levels' },
  { value: 'Reduce carrying-cost exposure', desc: 'Reduce recurring cost from excess inventory' },
  { value: 'Reduce stockout probability', desc: 'Protect at-risk stores and SKU-locations' },
  { value: 'Improve inventory turns', desc: 'Increase speed of inventory movement' },
  { value: 'Release working capital', desc: 'Reduce inventory value tied up in the network' },
  { value: 'Reduce slow-mover inventory', desc: 'Target low-velocity SKU-location combinations' },
  { value: 'Reduce transfer dependency', desc: 'Minimize rebalance complexity' },
]
export const II_SECONDARY_DEFAULT = ['Reduce duplicated buffers across echelons', 'Reduce carrying-cost exposure', 'Reduce stockout probability']

export const II_KPI_OPTIONS = [
  { value: 'Service attainment / in-stock', type: 'Service', rec: true },
  { value: 'Days inventory / safety stock', type: 'Inventory policy', rec: true },
  { value: 'Total network inventory', type: 'Capital', rec: true },
  { value: 'Carrying-cost reduction', type: 'Financial', rec: true },
  { value: 'Working-capital release', type: 'Financial', rec: true },
  { value: 'Stockout probability', type: 'Risk', rec: true },
  { value: 'Transfer viability score', type: 'Feasibility', rec: true },
  { value: 'Inventory turns', type: 'Efficiency', rec: false },
  { value: 'Slow-mover reduction', type: 'SKU rationalization', rec: false },
  { value: 'Policy performance vs baseline', type: 'Governance', rec: false },
]
export const II_KPI_DEFAULT = II_KPI_OPTIONS.filter(k => k.rec).map(k => k.value)

// ── Screen 3 — Simulation Levers (recommended = default) ────────────────────
export const II_LEVER_GROUPS = [
  {
    group: 'A', title: 'Safety-stock & target-stock levers', color: 'orange',
    levers: [
      { id: 'ssRightSize', label: 'Safety-stock right-sizing', control: 'select', options: ['Current policy', 'Reduce upstream/DC by 8–12%', 'Reduce upstream/DC by 15%'], recommended: 'Reduce upstream/DC by 8–12%' },
      { id: 'storeSSUplift', label: 'Store safety-stock uplift', control: 'select', options: ['Current policy', '+3–5% priority store/SKU', '+8% priority store/SKU'], recommended: '+3–5% priority store/SKU' },
      { id: 'targetStock', label: 'Target stock by echelon', control: 'select', options: ['Current target stock', 'Shift closer to demand nodes'], recommended: 'Shift closer to demand nodes' },
      { id: 'dosBand', label: 'Days-of-supply band', control: 'select', options: ['Current DOS', 'Min/max DOS by SKU velocity'], recommended: 'Min/max DOS by SKU velocity' },
      { id: 'serviceByCat', label: 'Service target by category', control: 'select', options: ['Current target', '98% priority / 96% standard'], recommended: '98% priority / 96% standard' },
    ],
  },
  {
    group: 'B', title: 'Cross-echelon inventory levers', color: 'violet',
    levers: [
      { id: 'deDup', label: 'Cross-echelon de-duplication', control: 'switch', recommended: true, onLabel: 'On' },
      { id: 'bufferPlacement', label: 'Upstream vs downstream buffer placement', control: 'select', options: ['Balanced', 'Move 10–15% downstream (high-risk SKUs)', 'Move upstream'], recommended: 'Move 10–15% downstream (high-risk SKUs)' },
      { id: 'dcToStore', label: 'DC-to-store rebalance', control: 'switch', recommended: true, onLabel: 'On for high-risk clusters' },
      { id: 'lateralTransfer', label: 'Lateral transfer between DCs', control: 'switch', recommended: true, onLabel: 'On if viability > 80%' },
      { id: 'transferCycleLimit', label: 'Transfer cycle-time limit', control: 'select', options: ['Current', 'Cap to executable within 48 hrs'], recommended: 'Cap to executable within 48 hrs' },
    ],
  },
  {
    group: 'C', title: 'Reorder & replenishment policy levers', color: 'teal',
    levers: [
      { id: 'reorderTuning', label: 'Reorder point tuning', control: 'select', options: ['Current policy', '+5–7% priority SKU-locations'], recommended: '+5–7% priority SKU-locations' },
      { id: 'reviewCadence', label: 'Review cadence', control: 'select', options: ['Current cadence', 'Higher-frequency for volatile SKUs'], recommended: 'Higher-frequency for volatile SKUs' },
      { id: 'replenFreq', label: 'Replenishment frequency', control: 'select', options: ['Current frequency', 'Increase for priority SKUs'], recommended: 'Increase for priority SKUs' },
      { id: 'moq', label: 'MOQ constraint', control: 'select', options: ['Editable', 'Locked (hard constraint)'], recommended: 'Locked (hard constraint)' },
      { id: 'storeSpace', label: 'Store space constraint', control: 'select', options: ['Editable', 'Locked (hard constraint)'], recommended: 'Locked (hard constraint)' },
    ],
  },
  {
    group: 'D', title: 'Uncertainty & risk levers', color: 'blue',
    levers: [
      { id: 'demandStress', label: 'Demand variability stress', control: 'select', options: ['+0%', '+10%', '+20%', '+30%'], recommended: '+20%' },
      { id: 'leadTimeStress', label: 'Lead-time variability stress', control: 'select', options: ['+0%', '+20%', '+30%'], recommended: '+20%' },
      { id: 'stockoutTrigger', label: 'Stockout risk threshold', control: 'select', options: ['>25% risk', '>20% risk', '>15% risk'], recommended: '>15% risk' },
      { id: 'slowMover', label: 'Slow-mover threshold', control: 'select', options: ['Current velocity rule', 'Flag SKUs below movement threshold'], recommended: 'Flag SKUs below movement threshold' },
      { id: 'transferViability', label: 'Transfer viability threshold', control: 'select', options: ['70% feasibility', '80% feasibility', '90% feasibility'], recommended: '80% feasibility' },
    ],
  },
  {
    group: 'E', title: 'Financial guardrail levers', color: 'green',
    levers: [
      { id: 'carryingCost', label: 'Carrying-cost assumption', control: 'select', options: ['Finance-approved baseline', 'Custom assumption'], recommended: 'Finance-approved baseline' },
      { id: 'wcTarget', label: 'Working-capital release target', control: 'select', options: ['No target', 'Exploratory target ($100M scenario)'], recommended: 'Exploratory target ($100M scenario)' },
      { id: 'shortageProxy', label: 'Shortage proxy cost', control: 'select', options: ['Current proxy', 'Increase for priority SKUs'], recommended: 'Increase for priority SKUs' },
      { id: 'transferCost', label: 'Transfer cost', control: 'select', options: ['Current transfer cost', 'Use actual route/node transfer cost'], recommended: 'Use actual route/node transfer cost' },
      { id: 'maxReductionCap', label: 'Max inventory reduction cap', control: 'select', options: ['None', 'Cap at service-safe level'], recommended: 'Cap at service-safe level' },
    ],
  },
]
export const II_ALL_LEVERS = II_LEVER_GROUPS.flatMap(g => g.levers)
export const II_LEVER_DEFAULTS = Object.fromEntries(II_ALL_LEVERS.map(l => [l.id, l.recommended]))

// ── Screen 4 — Simulation Summary ───────────────────────────────────────────
export const II_SCENARIO = {
  name: 'MEIO Inventory Rebalance Simulation',
  signal: 'Inventory Imbalance — Excess Upstream, Shortage Downstream',
  objective: 'Optimize inventory placement while protecting service and reducing duplicated buffers.',
  method: 'Current policy baseline + optimized policy variants + stochastic demand / lead-time stress test + efficient frontier comparison.',
}
export const II_SCOPE = [
  { item: 'Network scope', value: '10 DCs + in-scope stores' },
  { item: 'SKU scope', value: '8 impacted SKU families', note: 'demo value' },
  { item: 'Store/SKU combinations', value: '126 impacted combinations', note: 'demo value' },
  { item: 'Time horizon', value: '4–8 week policy horizon', note: 'demo value' },
  { item: 'Simulation runs', value: '1,000 Monte Carlo iterations', note: 'demo value' },
  { item: 'Baseline', value: 'Current inventory policy' },
  { item: 'Comparison policy sets', value: 'Current, service-first, capital-first, balanced MEIO' },
  { item: 'Hard constraints', value: 'MOQ, space capacity, transfer feasibility, transfer cycle time, planner approval' },
]
export const II_VARIANTS = [
  { scenario: 'Baseline — Current Policy', desc: 'Current node-by-node inventory posture' },
  { scenario: 'Scenario 1 — Service-First Buffer Shift', desc: 'More inventory closer to stores to protect in-stock' },
  { scenario: 'Scenario 2 — Capital-First De-Duplication', desc: 'Reduce duplicated buffers to release capital' },
  { scenario: 'Scenario 3 — Balanced MEIO Rebalance', desc: 'Balance in-stock protection, carrying-cost reduction, and working-capital release' },
]
export const II_VALIDATION = [
  'Demand forecast and variability available', 'Lead-time and lane variability available',
  'Current on-hand / on-order inventory available', 'Current safety stock and reorder policy available',
  'Service targets available by category / SKU class', 'Transfer feasibility and cycle time available',
  'MOQ and space constraints applied', 'Finance-approved carrying-cost assumptions linked',
  'Planner approval required before policy activation',
]

// ── Screen 5 — Simulation Results ───────────────────────────────────────────
export const II_BASELINE = [
  { kpi: 'Service attainment / in-stock', value: '94.1%' },
  { kpi: 'Stockout probability', value: '18.6%' },
  { kpi: 'Days inventory / safety stock', value: '24.8 days' },
  { kpi: 'Total network inventory', value: '$1.42B' },
  { kpi: 'Carrying-cost exposure', value: '$142M/yr' },
  { kpi: 'Working-capital release', value: '$0' },
  { kpi: 'Transfer viability score', value: '76%' },
  { kpi: 'Buffer duplication index', value: '1.34' },
]
export const II_RECOMMENDATIONS = [
  {
    id: 'ss-rightsize', rank: 3, tone: 'orange', recommended: false,
    cardTitle: 'Recommendation 1: Right-Size Safety Stock Without Violating Service',
    recommends: ['Reduce excess safety stock at over-buffered upstream/DC nodes while increasing targeted store-level protection for high-risk SKU-locations.'],
    kpi: [
      { k: 'Service attainment / in-stock', b: '94.1%', a: '96.8%', d: '+2.7 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '10.4%', d: '-8.2 pts' },
      { k: 'Days inventory / safety stock', b: '24.8 days', a: '22.9 days', d: '-1.9 days' },
      { k: 'Total network inventory', b: '$1.42B', a: '$1.35B', d: '-$70M' },
      { k: 'Carrying-cost exposure', b: '$142M', a: '$135M', d: '-$7M/yr' },
      { k: 'Transfer viability score', b: '76%', a: '80%', d: '+4 pts' },
    ],
    why: 'Directly uses the safety-stock right-sizing MEIO lever, which the value trace maps to safety stock / days-inventory and a ~$18M network-scale value pool.',
    bestWhen: 'Use when excess buffer exists but service targets cannot be compromised.',
    risk: 'If lead-time variability worsens beyond the simulation band, reduced upstream safety stock may need recalibration.',
    plan: {
      title: 'MEIO Plan — Safety-Stock Right-Sizing + Store Buffer Protection',
      objective: 'Cut duplicated upstream/DC safety stock while protecting downstream service on high-risk SKU-locations.',
      phases: [
        { name: 'Phase 1 — Identify over-buffer (0–8 hr)', actions: ['Flag SKU families with upstream/DC safety stock above policy target', 'Rank downstream store/SKU pairs by stockout probability'] },
        { name: 'Phase 2 — Right-size (8–48 hr)', actions: ['Reduce over-buffered upstream/DC safety stock by 8–12%', 'Increase priority store/SKU safety stock by 3–5%'] },
        { name: 'Phase 3 — Monitor (48–72 hr)', actions: ['Track service attainment and stockout probability vs plan', 'Recalibrate if lead-time variance exceeds the simulation band'] },
      ],
      changes: [
        { area: 'Safety stock (upstream/DC)', change: 'Reduce by 8–12% on over-buffered SKU families' },
        { area: 'Safety stock (store)', change: '+3–5% for priority store/SKU pairs' },
        { area: 'Target stock', change: 'Shift selected target stock closer to demand nodes' },
        { area: 'Transfer', change: 'No cross-echelon rebalance in this plan' },
      ],
      guardrails: ['Service target protected', 'MOQ hard constraint', 'Store space hard constraint', 'Planner approval'],
      expected: 'Service 94.1% → 96.8%; stockout 18.6% → 10.4%; network inventory −$70M; carrying cost −$7M/yr.',
      moves: [
        { node: 'DC-01 (Upstream)', sku: 'Dairy', qty: '−4,200 units', ss: '8.0 → 7.0 days', action: 'Right-size upstream safety stock' },
        { node: 'DC-04 (Upstream)', sku: 'Frozen', qty: '−3,100 units', ss: '9.0 → 8.0 days', action: 'Right-size upstream safety stock' },
        { node: 'Store cluster A (32 stores)', sku: 'Dairy', qty: '+1,800 units', ss: '2.1 → 3.0 days', action: 'Uplift store safety stock' },
        { node: 'Store cluster B (28 stores)', sku: 'Beverages', qty: '+1,500 units', ss: '2.3 → 3.1 days', action: 'Uplift store safety stock' },
      ],
    },
  },
  {
    id: 'dedup', rank: 2, tone: 'violet', recommended: false,
    cardTitle: 'Recommendation 2: Remove Duplicated Buffers and Rebalance Inventory',
    recommends: ['Identify duplicated safety stock across supplier/DC/store echelons, reduce duplicate buffers, and transfer available inventory to high-risk downstream nodes where transfer viability is above threshold.'],
    kpi: [
      { k: 'Service attainment / in-stock', b: '94.1%', a: '97.2%', d: '+3.1 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '8.7%', d: '-9.9 pts' },
      { k: 'Days inventory / safety stock', b: '24.8 days', a: '22.1 days', d: '-2.7 days' },
      { k: 'Total network inventory', b: '$1.42B', a: '$1.31B', d: '-$110M' },
      { k: 'Carrying-cost exposure', b: '$142M', a: '$131M', d: '-$11M/yr' },
      { k: 'Working-capital release', b: '$0', a: '$110M', d: '+$110M' },
      { k: 'Transfer viability score', b: '76%', a: '84%', d: '+8 pts' },
    ],
    why: 'Directly uses cross-echelon de-duplication, which the value trace maps to total network inventory and a ~$13M network-scale value pool.',
    bestWhen: 'Use when inventory exists in multiple echelons for the same service objective and downstream stores still show shortage risk.',
    risk: 'Transfer actions must respect transfer feasibility, cycle time, store space, and MOQ constraints.',
    plan: {
      title: 'MEIO Plan — Cross-Echelon De-Duplication + DC-to-Store Rebalance',
      objective: 'Remove overlapping safety stock across echelons and move freed inventory to high-risk downstream nodes.',
      phases: [
        { name: 'Phase 1 — Detect duplication (0–8 hr)', actions: ['Compute buffer duplication index by SKU/echelon', 'Identify DC inventory that can cover downstream shortage'] },
        { name: 'Phase 2 — De-duplicate & transfer (8–48 hr)', actions: ['Reduce duplicate buffers across supplier/DC/store nodes', 'Generate DC-to-store transfers where viability > 80%'] },
        { name: 'Phase 3 — Confirm (48–72 hr)', actions: ['Confirm receipts and refresh service-risk scores', 'Book working-capital release with finance'] },
      ],
      changes: [
        { area: 'Cross-echelon buffers', change: 'De-duplicate overlapping safety stock across echelons' },
        { area: 'Transfer (WMS)', change: 'DC-to-store rebalance where transfer viability > 80%' },
        { area: 'Working capital', change: 'Release ~$110M from reduced duplicated inventory' },
        { area: 'Safety stock (store)', change: 'Protect high-risk downstream nodes' },
      ],
      guardrails: ['Transfer feasibility & cycle time', 'MOQ & supplier constraints', 'Store space limits', 'Planner approval'],
      expected: 'Service 94.1% → 97.2%; stockout −9.9 pts; network inventory −$110M; working-capital release +$110M.',
      moves: [
        { node: 'DC-02 → Cluster C (24 stores)', sku: 'Dry grocery', qty: '6,400 units', ss: '+0.8 days', action: 'DC-to-store rebalance' },
        { node: 'DC-05 → Cluster A (32 stores)', sku: 'Beverages', qty: '5,200 units', ss: '+0.7 days', action: 'DC-to-store rebalance' },
        { node: 'DC-01 (de-dup)', sku: 'Dairy', qty: '−3,600 units', ss: '−1.2 days', action: 'Remove duplicated buffer' },
        { node: 'DC-07 (de-dup)', sku: 'Snacks', qty: '−2,900 units', ss: '−1.0 days', action: 'Remove duplicated buffer' },
      ],
    },
  },
  {
    id: 'balanced', rank: 1, tone: 'green', recommended: true,
    cardTitle: 'Recommendation 3: Balanced MEIO Rebalance — Recommended',
    recommends: ['Apply a balanced policy bundle: right-size upstream/DC buffers, de-duplicate cross-echelon safety stock, transfer inventory to high-risk downstream nodes, and adjust reorder points for priority SKU-locations.'],
    kpi: [
      { k: 'Service attainment / in-stock', b: '94.1%', a: '98.0%', d: '+3.9 pts' },
      { k: 'Stockout probability', b: '18.6%', a: '6.9%', d: '-11.7 pts' },
      { k: 'Days inventory / safety stock', b: '24.8 days', a: '21.6 days', d: '-3.2 days' },
      { k: 'Total network inventory', b: '$1.42B', a: '$1.28B', d: '-$140M' },
      { k: 'Carrying-cost exposure', b: '$142M', a: '$128M', d: '-$14M/yr' },
      { k: 'Working-capital release', b: '$0', a: '$140M', d: '+$140M' },
      { k: 'Transfer viability score', b: '76%', a: '83%', d: '+7 pts' },
      { k: 'Buffer duplication index', b: '1.34', a: '1.08', d: '-0.26' },
    ],
    why: 'Combines the MEIO decision levers — safety-stock right-sizing, cross-echelon de-duplication, transfer/rebalance, and reorder-policy updates — to minimize network inventory and carrying cost while maximizing in-stock and working-capital release.',
    bestWhen: 'Use when the goal is to protect service and reduce inventory capital at the same time.',
    risk: 'High-impact policy changes require planner and finance approval before activation.',
    plan: {
      title: 'MEIO Plan — Balanced Policy Bundle',
      objective: 'Protect service and release inventory capital simultaneously via a coordinated MEIO policy bundle.',
      phases: [
        { name: 'Phase 1 — Right-size & de-duplicate (0–24 hr)', actions: ['Right-size over-buffered upstream/DC safety stock', 'De-duplicate cross-echelon buffers'] },
        { name: 'Phase 2 — Rebalance & retune (12–48 hr)', actions: ['Transfer inventory to high-risk downstream nodes (viability > 80%)', 'Raise reorder points 5–7% for priority SKU-locations'] },
        { name: 'Phase 3 — Approve & book (24–72 hr)', actions: ['Route to planner + finance for sign-off', 'Book carrying-cost and working-capital impact separately'] },
        { name: 'Phase 4 — Confirm & learn', actions: ['Confirm realized service and capital deltas', 'Update demand/lead-time priors and policy thresholds'] },
      ],
      changes: [
        { area: 'Safety stock', change: 'Right-size upstream/DC (−8–12%); protect store (+3–5%)' },
        { area: 'Cross-echelon buffers', change: 'De-duplicate overlapping safety stock' },
        { area: 'Transfer (WMS)', change: 'Rebalance to high-risk downstream nodes' },
        { area: 'Reorder policy (APS)', change: 'Raise reorder points 5–7% for priority SKU-locations' },
        { area: 'Working capital', change: 'Release ~$140M; carrying cost −$14M/yr' },
      ],
      guardrails: ['Scoped nodes (10 DCs + stores)', 'MOQ & supplier constraints', 'Store space', 'Transfer feasibility & cycle time', 'Finance-approved carrying cost', 'Planner + finance approval'],
      expected: 'Service 94.1% → 98.0%; stockout 18.6% → 6.9%; network inventory −$140M; working-capital release +$140M; duplication 1.34 → 1.08.',
      moves: [
        { node: 'DC-01 / DC-04 (right-size)', sku: 'Dairy, Frozen', qty: '−7,300 units', ss: '−1.1 days', action: 'Right-size upstream buffer' },
        { node: 'DC-02 → Cluster C (24 stores)', sku: 'Dry grocery', qty: '6,400 units', ss: '+0.8 days', action: 'DC-to-store rebalance' },
        { node: 'DC-05 → Cluster A (32 stores)', sku: 'Beverages', qty: '5,200 units', ss: '+0.7 days', action: 'DC-to-store rebalance' },
        { node: 'Store clusters A/B (60 stores)', sku: 'Priority SKUs', qty: '+3,300 units', ss: '+0.9 days', action: 'Reorder-point uplift 5–7%' },
        { node: 'DC-07 (de-dup)', sku: 'Snacks', qty: '−2,900 units', ss: '−1.0 days', action: 'Remove duplicated buffer' },
      ],
    },
  },
]
export const II_RANKING = [
  { rank: 1, reco: 'Balanced MEIO Policy Bundle', service: 'Highest', capital: 'High', cost: 'High', feasibility: 'Medium-high', select: 'Selected' },
  { rank: 2, reco: 'Cross-Echelon De-Duplication + DC-to-Store Rebalance', service: 'High', capital: 'High', cost: 'Medium-high', feasibility: 'High', select: 'Alternative' },
  { rank: 3, reco: 'Safety-Stock Right-Sizing + Store Buffer Protection', service: 'Medium-high', capital: 'Medium', cost: 'Medium', feasibility: 'Highest', select: 'Alternative' },
]

// ── Screen 6 — Approval & Execution ─────────────────────────────────────────
// ── Screen 1 — MEIO imbalance visuals ───────────────────────────────────────
export const II_IMPACT = [
  { label: 'Trapped capital', value: '$1.8M', color: 'red' },
  { label: 'Excess inventory (upstream)', value: '+14%', color: 'orange' },
  { label: 'Service risk (stockout prob.)', value: '18.6%', color: 'orange' },
  { label: 'Stockout exposure', value: '$2.1M', color: 'violet' },
]
// Imbalance heatmap — echelon rows × SKU-family cols; % vs policy (+excess / −shortage)
export const II_HEATMAP = {
  rows: ['Supplier', 'DC-01', 'DC-02', 'Store Cluster A', 'Store Cluster B'],
  cols: ['Dairy', 'Frozen', 'Bev', 'Dry', 'Snacks', 'Produce', 'Bakery', 'Meat'],
  cells: [
    [12, 9, 14, 6, 4, 2, 3, 5],
    [18, 22, 15, 11, 8, 3, 6, 9],
    [9, 6, 12, 7, 5, 2, 4, 6],
    [-14, -9, -18, -6, -3, -1, -2, -4],
    [-11, -7, -15, -8, -4, -2, -3, -6],
  ],
}
// Inventory location by echelon (on-hand vs policy target, units)
export const II_INV_LOCATION = [
  { label: 'Supplier A', type: 'supplier', onHand: 9200, policy: 8000 },
  { label: 'DC-01', type: 'dc', onHand: 14800, policy: 11000 },
  { label: 'DC-02', type: 'dc', onHand: 10600, policy: 9500 },
  { label: 'Store Cluster A', type: 'store', onHand: 2100, policy: 3400 },
  { label: 'Store Cluster B', type: 'store', onHand: 1800, policy: 3100 },
]
// Efficient frontier — x: total network inventory ($B), y: service %, z: working-capital release ($M)
export const II_FRONTIER = {
  xLabel: 'Total network inventory ($B)', yLabel: 'Service attainment (%)', zLabel: 'Working-capital release ($M)',
  points: [
    { x: 1.42, y: 94.1, z: 0, label: 'Current policy', tone: 'gray' },
    { x: 1.35, y: 96.8, z: 70, label: 'Safety Stock', tone: 'orange' },
    { x: 1.31, y: 97.2, z: 110, label: 'Rebalance', tone: 'violet' },
    { x: 1.28, y: 95.6, z: 160, label: 'Capital', tone: 'blue' },
    { x: 1.28, y: 98.0, z: 140, label: 'Balanced', tone: 'green', recommended: true },
  ],
}
// Four comparable strategies (service / inventory / capital / feasibility / effort / confidence)
export const II_STRATEGIES = [
  { name: 'Safety Stock Strategy', tone: 'orange', recommended: false, metrics: [
    { label: 'Service', value: '96.8%', pct: 80 }, { label: 'Inventory ↓', value: '$70M', pct: 44 }, { label: 'Capital release', value: '$70M', pct: 44 },
    { label: 'Feasibility', value: 'High', pct: 85 }, { label: 'Effort', value: 'Low', pct: 30 }, { label: 'Confidence', value: '88%', pct: 88 },
  ] },
  { name: 'Rebalance Strategy', tone: 'violet', recommended: false, metrics: [
    { label: 'Service', value: '97.2%', pct: 86 }, { label: 'Inventory ↓', value: '$110M', pct: 69 }, { label: 'Capital release', value: '$110M', pct: 69 },
    { label: 'Feasibility', value: 'High', pct: 82 }, { label: 'Effort', value: 'Medium', pct: 55 }, { label: 'Confidence', value: '85%', pct: 85 },
  ] },
  { name: 'Capital Strategy', tone: 'blue', recommended: false, metrics: [
    { label: 'Service', value: '95.6%', pct: 66 }, { label: 'Inventory ↓', value: '$160M', pct: 100 }, { label: 'Capital release', value: '$160M', pct: 100 },
    { label: 'Feasibility', value: 'Medium', pct: 62 }, { label: 'Effort', value: 'Medium', pct: 58 }, { label: 'Confidence', value: '82%', pct: 82 },
  ] },
  { name: 'Balanced Strategy', tone: 'green', recommended: true, metrics: [
    { label: 'Service', value: '98.0%', pct: 96 }, { label: 'Inventory ↓', value: '$140M', pct: 88 }, { label: 'Capital release', value: '$140M', pct: 88 },
    { label: 'Feasibility', value: 'Medium-high', pct: 74 }, { label: 'Effort', value: 'Medium-high', pct: 70 }, { label: 'Confidence', value: '90%', pct: 90 },
  ] },
]
// Inventory movement before vs after (Balanced) — units on-hand by echelon
export const II_INV_MOVE = {
  before: II_INV_LOCATION,
  after: [
    { label: 'Supplier A', type: 'supplier', onHand: 8100, policy: 8000 },
    { label: 'DC-01', type: 'dc', onHand: 11200, policy: 11000 },
    { label: 'DC-02', type: 'dc', onHand: 9700, policy: 9500 },
    { label: 'Store Cluster A', type: 'store', onHand: 3300, policy: 3400 },
    { label: 'Store Cluster B', type: 'store', onHand: 3050, policy: 3100 },
  ],
}
// Placement optimization detail per recommendation id
export const II_OPTIMIZATION = {
  'ss-rightsize': { safetyStock: 'Upstream/DC −8–12%; store +3–5%', reorderPoint: 'Unchanged', transfer: 'None', placement: 'Buffer held; store uplift only' },
  dedup: { safetyStock: 'De-duplicate cross-echelon buffers', reorderPoint: 'Unchanged', transfer: 'DC-to-store where viability > 80%', placement: 'Shift freed buffer downstream' },
  balanced: { safetyStock: 'Right-size upstream −8–12%; store +3–5%', reorderPoint: '+5–7% priority SKU-locations', transfer: 'DC-to-store + lateral (viability > 80%)', placement: 'Move 10–15% buffer downstream for high-risk SKUs' },
}
// Screen 7 — Learn: model & policy updates
export const II_LEARN = {
  updates: [
    { label: 'Demand model', before: 'CV 0.24', after: 'CV 0.29', delta: '+variance', note: 'Priority SKUs more volatile than forecast' },
    { label: 'Lead-time model', before: 'σ 8 hr', after: 'σ 11 hr', delta: '+3 hr', note: 'Widened lead-time variance band' },
    { label: 'Safety-stock policy', before: 'Static', after: 'Velocity-tiered', delta: 'updated', note: 'DOS band by SKU velocity class' },
    { label: 'Transfer rules', before: '≥ 70% viability', after: '≥ 80% viability', delta: 'tightened', note: 'Filter low-feasibility transfers' },
    { label: 'Optimization parameters', before: 'Service weight 0.5', after: '0.6', delta: '+service', note: 'Higher service weight vs capital' },
  ],
}

export const II_APPROVAL = {
  selected: 'Balanced MEIO Policy Bundle',
  action: 'Right-size safety stock + de-duplicate cross-echelon buffers + rebalance inventory to high-risk downstream nodes + adjust reorder points for priority SKU-locations.',
  summary: [
    { field: 'Approval type', value: 'Planner + finance approval required' },
    { field: 'Execution mode', value: 'Recommendation-led workflow' },
    { field: 'Auto-execution', value: 'Disabled in Wave 1' },
    { field: 'Target workflows', value: 'Inventory planning, replenishment planning, WMS / APS handoff' },
    { field: 'Audit status', value: 'Decision log will be created' },
    { field: 'Financial status', value: 'Carrying-cost and working-capital impact shown separately' },
  ],
  execItems: [
    { item: 'Safety-stock change cards', target: 'Inventory planning', action: 'Apply recommended safety-stock changes by SKU/echelon' },
    { item: 'Reorder-point update list', target: 'APS / planning workflow', action: 'Adjust reorder points for priority SKU-locations' },
    { item: 'Transfer / rebalance candidates', target: 'WMS / replenishment planning', action: 'Move inventory to high-risk downstream nodes' },
    { item: 'De-duplication list', target: 'Inventory policy review', action: 'Remove duplicated buffers across echelons' },
    { item: 'Financial impact pack', target: 'Supply Chain Finance', action: 'Review carrying-cost reduction and working-capital release' },
    { item: 'Decision log', target: 'Governance layer', action: 'Store rationale, constraints, expected KPI delta, approval history' },
  ],
  rationale: 'The Balanced MEIO Policy Bundle delivers the strongest combined improvement across service, inventory capital, and carrying-cost KPIs. It protects store service by moving inventory closer to demand where needed, reduces duplicate buffers across echelons, and improves inventory posture without breaching MOQ, transfer feasibility, store capacity, or planner-approval constraints.',
  constraints: ['Scoped nodes only: 10 DCs + in-scope stores', 'No ERP/WMS master-data redesign', 'Store space and capacity limits honored', 'MOQ and supplier constraints honored', 'Transfer feasibility and cycle time checked', 'Service targets protected', 'Finance-approved carrying-cost assumptions linked', 'Planner approval required'],
  buttons: ['Approve & Send to Execution', 'Modify Policy Bundle', 'Send for Finance Review', 'Reject Recommendation', 'Save as Draft Scenario'],
}

// ── Screen 7 — Learn & Save ─────────────────────────────────────────────────
export const II_OUTCOMES = [
  { metric: 'Service attainment / in-stock', pred: '98.0%', actual: '97.4%', learn: 'Slightly optimistic; recalibrate store-risk model' },
  { metric: 'Stockout probability', pred: '6.9%', actual: '7.6%', learn: 'Increase weight on demand variance' },
  { metric: 'Days inventory / safety stock', pred: '21.6 days', actual: '21.9 days', learn: 'Within acceptable variance' },
  { metric: 'Total network inventory', pred: '$1.28B', actual: '$1.30B', learn: 'Inventory reduction slightly below plan' },
  { metric: 'Carrying-cost exposure', pred: '$128M', actual: '$130M', learn: 'Savings slightly lower than predicted' },
  { metric: 'Working-capital release', pred: '$140M', actual: '$120M', learn: 'Update capital-release confidence band' },
  { metric: 'Transfer viability score', pred: '83%', actual: '80%', learn: 'Transfer cycle-time assumption needs adjustment' },
  { metric: 'Buffer duplication index', pred: '1.08', actual: '1.12', learn: 'De-duplication achieved but less than simulated' },
]
export const II_INSIGHTS = [
  'Transfer cycle time was slightly longer than expected for two downstream store clusters.',
  'Demand variability was higher than the forecast distribution for selected priority SKUs.',
  'Cross-echelon de-duplication reduced duplicated buffers, but some remained due to MOQ and supplier constraints.',
  'Service was protected with lower inventory than baseline, but capital release was below simulated expectation.',
  'Future similar scenarios should use a higher transfer-cycle buffer and wider demand-variance band.',
]
export const II_SAVE = {
  name: 'MEIO Inventory Imbalance — Balanced Rebalance Policy',
  description: 'Optimizes inventory placement across supplier, DC, and store echelons by reducing duplicated upstream/DC buffers, protecting downstream service, and generating transfer/rebalance and reorder-policy recommendations.',
  tags: ['MEIO', 'INVENTORY IMBALANCE', 'SAFETY-STOCK RIGHT-SIZING', 'CROSS-ECHELON DE-DUPLICATION', 'STORE SERVICE RISK', 'WORKING-CAPITAL RELEASE', 'TRANSFER / REBALANCE'],
  exitOptions: ['Save to Scenario Library', 'Export Decision Log', 'Open Efficient Frontier Dashboard', 'Exit Guided Flow'],
}

export const II_LOADING_LINES = {
  1: ['Ingesting ERP · APS · inventory ledger…', 'Scoring echelon buffer vs demand…', 'Matching MEIO imbalance precedents…', 'Signal analysis ready.'],
  2: ['Loading MEIO objective framework…', 'Aligning capital + service KPIs…', 'Objectives ready.'],
  3: ['Loading MEIO levers…', 'Applying recommended configuration…', 'Levers ready.'],
  4: ['Assembling policy scenario setup…', 'Running pre-run validation checks…', 'Summary ready.'],
  5: ['Running current vs optimized policy…', 'Stress-testing demand + lead-time…', 'Ranking policy bundles…'],
  6: ['Assembling policy execution package…', 'Validating constraints + finance guardrails…', 'Ready for planner + finance approval.'],
  7: ['Capturing realized service + capital deltas…', 'Comparing predicted vs actual…', 'Updating priors + scenario library…'],
}
