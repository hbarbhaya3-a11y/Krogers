import { useState } from 'react'
import {
  Stack, Group, Text, Badge, Button, Box, ThemeIcon, Title,
  Card, Divider, ScrollArea, TextInput, Select,
} from '@mantine/core'
import {
  IconSparkles, IconRoute2, IconRadar, IconUsers, IconChartBar,
  IconLayoutGrid, IconCircleCheck, IconShieldCheck, IconRocket,
  IconTrendingUp, IconSearch, IconChevronRight, IconBolt,
  IconUsersGroup, IconSitemap, IconMathFunction, IconPencil,
  IconPlayerPlay,
} from '@tabler/icons-react'
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import { useCases } from '../data/usecases'
import { useUseCase } from '../contexts/UseCaseContext'

// ── Step icon map ──────────────────────────────────────────────────────────────
const STEP_ICONS = {
  signal_detection:           { icon: IconRadar,        color: 'teal'        },
  participant_segmentation:   { icon: IconUsersGroup,   color: 'blue'        },
  simulation:                 { icon: IconMathFunction, color: 'violet'      },
  participant_channel_config: { icon: IconSitemap,      color: 'orange'      },
  human_approval:             { icon: IconCircleCheck,  color: 'red'         },
  compliance:                 { icon: IconShieldCheck,  color: 'green'       },
  content_generation:         { icon: IconPencil,       color: 'grape'       },
  deployment:                 { icon: IconRocket,       color: 'orange'      },
  attribution:                { icon: IconTrendingUp,   color: 'teal'        },
}

// ── Live signals ───────────────────────────────────────────────────────────────
// Kroger Supply Chain Resilience — Network Flow & Resilience + MEIO signals.
// Demo values only; replace with live Kroger feed values when available.
const LIVE_SIGNALS = [
  {
    ucId: 'uc-supplier-delay-surge',
    // Links to an existing workflow so Run scenario opens the Guided/Autopilot
    // modal today; these target pages get re-skinned in a later prompt.
    linkedUseCaseId: 'uc-advisory-readiness',
    severity: 'HIGH',
    severityColor: 'orange',
    stage: 'SENSE',
    title: 'Supplier Delay Surge — High-Volume DC Flow at Risk',
    description: 'ASN revision and supplier commitment variance indicate delayed inbound volume affecting a high-volume DC and dependent store replenishment flows.',
    detail: 'Supplier commitment data and ASN revisions indicate that inbound volume for a high-volume DC has shifted outside the planned receiving window. TwinX links the delay to dependent lanes, DC capacity, store replenishment orders, and service-risk exposure before recommending recovery actions.',
    sourceChip: 'SUPPLIER / ASN FEED',
    agent: 'Network Sentinel',
    date: '7/07/2026',
    metricValue: '42',
    metricUnit: 'delayed POs',
    metricStripLabel: 'Delayed POs / ASNs',
    metricSub: 'high-volume DC',
    tags: ['SUPPLIER COMMITMENT VARIANCE', 'ASN REVISION EVENT', 'INBOUND ETA BREACH', 'HIGH-VOLUME DC', 'NETWORK SENTINEL'],
    precedents: 3,
    precedentNote: null,
    confidence: 91,
    window: '24–48 hr recovery window',
    trendLabel: 'INBOUND DELAY EXPOSURE TREND — Supplier → DC Flow',
    trendData: [
      { x: 'W-6', v: 4 }, { x: 'W-5', v: 7 }, { x: 'W-4', v: 12 },
      { x: 'W-3', v: 19 }, { x: 'W-2', v: 27 }, { x: 'W-1', v: 35 }, { x: 'Now', v: 42 },
    ],
    scenario: 'Supplier Delay Recovery',
    scenarioSub: 'Supplier delay → DC flow impact → store service risk → reroute / rebalance / premium-freight avoidance',
  },
  {
    ucId: 'uc-dc-capacity-stress',
    linkedUseCaseId: 'uc-idle-cash',
    severity: 'HIGH',
    severityColor: 'orange',
    stage: 'SENSE',
    title: 'DC Capacity Stress — Throughput Below Required Flow',
    description: 'DC throughput and dock occupancy signals indicate constrained receiving capacity, creating backlog risk for inbound and outbound flows.',
    detail: 'DC throughput has fallen below the required flow level while dock occupancy and backlog are increasing. TwinX identifies whether the issue can be absorbed within the same DC, whether volume should be shifted, or whether downstream replenishment needs to be resequenced.',
    sourceChip: 'WMS / DC OPS FEED',
    agent: 'Flow Sentinel',
    date: '7/07/2026',
    metricValue: '18%',
    metricUnit: 'capacity variance',
    metricStripLabel: 'Capacity variance',
    metricSub: 'below required flow',
    tags: ['DC THROUGHPUT CONSTRAINT', 'DOCK OCCUPANCY RISING', 'BACKLOG SPIKE', 'CAPACITY DERATE', 'FLOW SENTINEL'],
    precedents: 4,
    precedentNote: null,
    confidence: 88,
    window: '12–24 hr response window',
    trendLabel: 'DC THROUGHPUT STRESS TREND — Planned vs Available Capacity',
    trendData: [
      { x: 'W-6', v: 2 }, { x: 'W-5', v: 4 }, { x: 'W-4', v: 6 },
      { x: 'W-3', v: 9 }, { x: 'W-2', v: 12 }, { x: 'W-1', v: 15 }, { x: 'Now', v: 18 },
    ],
    scenario: 'DC Capacity Shift Simulation',
    scenarioSub: 'Capacity derate → backlog propagation → alternate DC/lane evaluation → recovery plan',
  },
  {
    ucId: 'uc-premium-freight-risk',
    linkedUseCaseId: 'uc-diversification',
    severity: 'MEDIUM-HIGH',
    severityColor: 'yellow',
    stage: 'SENSE',
    title: 'Premium Freight Risk Rising — ETA Breach and Time-to-Need Compression',
    description: 'ETA variance, lane variability, and service-window pressure indicate increased probability of premium freight intervention.',
    detail: 'ETA uncertainty and time-to-need compression indicate that selected loads may require premium freight if the current plan continues. TwinX evaluates whether lower-cost recovery options such as rerouting, carrier swap, load resequencing, or inventory rebalance can protect service before premium freight is triggered.',
    sourceChip: 'TMS / CARRIER FEED',
    agent: 'Cost Sentinel',
    date: '7/07/2026',
    metricValue: '27',
    metricUnit: 'at-risk loads',
    metricStripLabel: 'At-risk loads',
    metricSub: 'premium freight exposure',
    tags: ['ETA BREACH RISK', 'TIME-TO-NEED COMPRESSION', 'PREMIUM FREIGHT RISK', 'CARRIER ACCEPTANCE RISK', 'COST SENTINEL'],
    precedents: 2,
    precedentNote: 'Limited history',
    confidence: 84,
    window: '24 hr cost-control window',
    trendLabel: 'PREMIUM FREIGHT RISK TREND — At-Risk Loads',
    trendData: [
      { x: 'W-6', v: 3 }, { x: 'W-5', v: 6 }, { x: 'W-4', v: 9 },
      { x: 'W-3', v: 14 }, { x: 'W-2', v: 19 }, { x: 'W-1', v: 23 }, { x: 'Now', v: 27 },
    ],
    scenario: 'Premium Freight Avoidance',
    scenarioSub: 'ETA breach risk → cost exposure → reroute / carrier swap / MEIO substitution',
  },
  {
    ucId: 'uc-store-service-risk',
    linkedUseCaseId: 'uc-volatility-reassurance',
    severity: 'HIGH',
    severityColor: 'orange',
    stage: 'SENSE',
    title: 'Store Service Risk — At-Risk Replenishment Orders',
    description: 'Delayed inbound flow plus low inventory cover indicates downstream service risk for priority stores and SKUs.',
    detail: 'Delayed replenishment and low inventory cover indicate rising service risk across priority store/SKU combinations. TwinX connects transportation delays with inventory posture so planners can compare whether service should be protected through priority reroute, inventory rebalance, store allocation change, or selected premium freight.',
    sourceChip: 'OMS / INVENTORY FEED',
    agent: 'Service Sentinel',
    date: '7/07/2026',
    metricValue: '126',
    metricUnit: 'stores at risk',
    metricStripLabel: 'Stores at risk',
    metricSub: 'priority store/SKU',
    tags: ['STORE SERVICE RISK', 'LOW INVENTORY COVER', 'DELAYED REPLENISHMENT', 'STOCKOUT PROBABILITY', 'SERVICE SENTINEL'],
    precedents: 5,
    precedentNote: null,
    confidence: 87,
    window: '24–72 hr service window',
    trendLabel: 'STORE SERVICE RISK TREND — At-Risk Stores / SKU-Locations',
    trendData: [
      { x: 'W-6', v: 12 }, { x: 'W-5', v: 24 }, { x: 'W-4', v: 40 },
      { x: 'W-3', v: 62 }, { x: 'W-2', v: 88 }, { x: 'W-1', v: 108 }, { x: 'Now', v: 126 },
    ],
    scenario: 'Service Protection Simulation',
    scenarioSub: 'Delayed replenishment → store service risk → priority allocation / reroute / rebalance',
  },
  {
    ucId: 'uc-inventory-imbalance',
    linkedUseCaseId: 'uc-rollover-ira',
    severity: 'MEDIUM',
    severityColor: 'blue',
    stage: 'SENSE',
    title: 'Inventory Imbalance — Excess Upstream, Shortage Downstream',
    description: 'MEIO signals show excess inventory in upstream echelons while downstream stores face stockout risk.',
    detail: 'MEIO signals show that inventory is available in the network but not necessarily in the right echelon to protect downstream service. TwinX evaluates whether inventory should be held upstream, moved downstream, transferred laterally, or protected as safety stock while respecting capacity, MOQ, transfer feasibility, and service constraints.',
    sourceChip: 'ERP / APS / INVENTORY LEDGER',
    agent: 'MEIO Sentinel',
    date: '7/07/2026',
    metricValue: '8',
    metricUnit: 'SKU families',
    metricStripLabel: 'SKU families impacted',
    metricSub: 'upstream excess / downstream risk',
    tags: ['BUFFER DUPLICATION', 'SAFETY STOCK IMBALANCE', 'ON-HAND SHORTAGE', 'UPSTREAM EXCESS', 'MEIO SENTINEL'],
    precedents: 4,
    precedentNote: null,
    confidence: 89,
    window: '48–72 hr rebalance window',
    trendLabel: 'INVENTORY IMBALANCE TREND — Upstream Excess vs Downstream Risk',
    trendData: [
      { x: 'W-6', v: 1 }, { x: 'W-5', v: 2 }, { x: 'W-4', v: 3 },
      { x: 'W-3', v: 4 }, { x: 'W-2', v: 6 }, { x: 'W-1', v: 7 }, { x: 'Now', v: 8 },
    ],
    scenario: 'MEIO Rebalance Simulation',
    scenarioSub: 'Inventory imbalance → service/capital trade-off → optimal buffer placement / transfer plan',
  },
]

// ── Step icon chain ────────────────────────────────────────────────────────────
function StepChain({ steps, color }) {
  return (
    <Group gap={6} wrap="nowrap" align="center">
      {steps.map((step, i) => {
        const meta = STEP_ICONS[step.panelType] || { icon: IconBolt, color: 'gray' }
        const Icon = meta.icon
        const isAgent = step.actor === 'agent'
        return (
          <Group key={i} gap={6} wrap="nowrap" align="center">
            <ThemeIcon
              size={28}
              radius="xl"
              variant={isAgent ? 'light' : 'filled'}
              color={meta.color}
              style={{ flexShrink: 0 }}
            >
              <Icon size={14} stroke={1.8} />
            </ThemeIcon>
            {i < steps.length - 1 && (
              <Box
                style={{
                  width: 18, height: 1.5, flexShrink: 0,
                  background: `var(--mantine-color-${color}-3)`,
                  borderRadius: 2,
                }}
              />
            )}
          </Group>
        )
      })}
      <Text size="xs" c="dimmed" fw={500} ml={4}>{steps.length} STEPS</Text>
    </Group>
  )
}

// ── Signal severity badge ──────────────────────────────────────────────────────
function SeverityBadge({ severity, color }) {
  return (
    <Badge
      size="xs"
      variant="filled"
      color={color}
      style={{ letterSpacing: '0.04em', fontWeight: 700 }}
    >
      {severity}
    </Badge>
  )
}

// ── Trend chart ────────────────────────────────────────────────────────────────
function SignalTrendChart({ data, color, unit }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`var(--mantine-color-${color}-6)`} stopOpacity={0.25} />
            <stop offset="95%" stopColor={`var(--mantine-color-${color}-6)`} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="x"
          tick={{ fontSize: 10, fill: 'var(--mantine-color-dimmed)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'var(--mantine-color-dimmed)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 6, padding: '4px 10px' }}
          formatter={v => [v.toLocaleString(), unit || 'Value']}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={`var(--mantine-color-${color}-6)`}
          strokeWidth={2}
          fill="url(#sigGrad)"
          dot={{ r: 3, fill: `var(--mantine-color-${color}-6)` }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function UseCaseCatalog({ onRunScenario }) {
  const { launch } = useUseCase()
  const [selectedSignalIdx, setSelectedSignalIdx] = useState(0)
  const [signalFilter, setSignalFilter] = useState('All')

  const handleRun = (uc) => {
    if (onRunScenario) onRunScenario(uc)
    else launch(uc)
  }

  const handleRunSignalScenario = (signal) => {
    // Resolve the signal to an existing workflow — prefer the explicit link,
    // fall back to matching the scenario name to a use-case title.
    const uc = useCases.find(u => u.id === signal.linkedUseCaseId)
      || useCases.find(u => u.title === signal.scenario)
    if (uc) handleRun(uc)
  }

  const selectedSignal = LIVE_SIGNALS[selectedSignalIdx]

  const filteredSignals = signalFilter === 'All'
    ? LIVE_SIGNALS
    : LIVE_SIGNALS.filter(s => s.severity === signalFilter)

  return (
    <Stack gap="lg">
      {/* ── Header banner ──────────────────────────────────────────────── */}
      <Card withBorder radius="md" p="md" style={{ borderLeft: '3px solid var(--mantine-color-vanguardRed-6)' }}>
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
          <Box>
            <Group gap="xs" mb={4}>
              <ThemeIcon size={22} radius="md" variant="gradient" gradient={{ from: '#96151D', to: '#C0392B', deg: 135 }}>
                <IconSparkles size={12} color="white" />
              </ThemeIcon>
              <Text fw={800} size="sm" tt="uppercase" style={{ letterSpacing: '0.06em' }}>
                Supply Chain Resilience Signals for Kroger's Network
              </Text>
            </Group>
            <Text size="xs" c="dimmed" maw={580}>
              Network Flow & Resilience · MEIO optimization · reroute, rebalance & premium-freight avoidance
            </Text>
          </Box>
          <Group gap="xs" wrap="wrap">
            {['Simulation-Native', '6-Stage Lifecycle', 'Guided & Autopilot Modes', 'Closed-Loop Learning'].map(t => (
              <Badge key={t} variant="outline" color="vanguardRed" size="xs" style={{ letterSpacing: '0.04em', fontWeight: 600 }}>
                {t}
              </Badge>
            ))}
          </Group>
        </Group>
      </Card>

      {/* ════════════════ LIVE SIGNALS ════════════════════════════════ */}
      <Group align="flex-start" gap="md" wrap="nowrap" style={{ minHeight: 600 }}>
          {/* ── Signal list ───────────────────────────────── */}
          <Stack gap="xs" style={{ width: 320, flexShrink: 0 }}>
            {/* Search + filter */}
            <TextInput
              placeholder="Search signals..."
              size="xs"
              radius="md"
              leftSection={<IconSearch size={13} />}
              styles={{ input: { fontSize: 12 } }}
            />
            <Select
              size="xs"
              radius="md"
              data={['All', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM']}
              value={signalFilter}
              onChange={v => setSignalFilter(v || 'All')}
              styles={{ input: { fontSize: 12 } }}
            />
            <Text size="10px" c="dimmed" style={{ letterSpacing: '0.06em' }}>
              Live signals map 1:1 to scenarios
            </Text>

            <ScrollArea h={560} type="scroll" offsetScrollbars>
              <Stack gap={6} pr={8}>
                {filteredSignals.map((sig, idx) => {
                  const realIdx = LIVE_SIGNALS.indexOf(sig)
                  const isSelected = realIdx === selectedSignalIdx
                  return (
                    <Card
                      key={sig.ucId}
                      withBorder
                      radius="md"
                      p="sm"
                      onClick={() => setSelectedSignalIdx(realIdx)}
                      style={{
                        cursor: 'pointer',
                        borderColor: isSelected ? `var(--mantine-color-${sig.severityColor}-6)` : undefined,
                        background: isSelected ? `var(--mantine-color-${sig.severityColor}-light)` : undefined,
                      }}
                    >
                      <Group mb={4} gap="xs">
                        <SeverityBadge severity={sig.severity} color={sig.severityColor} />
                      </Group>
                      <Text fw={600} size="xs" style={{ lineHeight: 1.35 }} mb={4}>
                        {sig.title}
                      </Text>
                      <Text size="10px" c="dimmed" lineClamp={2} mb={6}>
                        {sig.description}
                      </Text>
                      <Group gap="xs" mb={4}>
                        <Group gap={4}>
                          <IconUsers size={11} />
                          <Text size="10px">{sig.metricValue} {sig.metricUnit}</Text>
                        </Group>
                        <Text size="10px" c="dimmed">·</Text>
                        <Text size="10px">{sig.precedents} precedents</Text>
                      </Group>
                      <Group justify="space-between" align="center">
                        <Text size="9px" c="dimmed">{sig.sourceChip.split('·')[0].trim()}</Text>
                        <Text size="9px" c="dimmed">{sig.window}</Text>
                      </Group>
                    </Card>
                  )
                })}
              </Stack>
            </ScrollArea>
          </Stack>

          {/* ── Signal detail ─────────────────────────────── */}
          {selectedSignal && (
            <Card withBorder radius="md" p="md" style={{ flex: 1 }}>
              {/* Header */}
              <Group gap="xs" mb="xs" align="flex-start">
                <ThemeIcon size={28} radius="xl" variant="light" color={selectedSignal.severityColor}>
                  <IconBolt size={14} stroke={2} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Group gap="xs" mb={2} wrap="wrap">
                    <Text fw={700} size="sm" style={{ lineHeight: 1.3 }}>{selectedSignal.title}</Text>
                  </Group>
                  <Group gap="xs">
                    <SeverityBadge severity={selectedSignal.severity} color={selectedSignal.severityColor} />
                  </Group>
                </Box>
              </Group>

              {/* Stats row */}
              <Group gap="xl" mb="md" wrap="wrap">
                <Box>
                  <Text fw={800} size="xl" c="green">{selectedSignal.confidence}%</Text>
                  <Text size="10px" c="dimmed">Confidence</Text>
                  <Box style={{ width: 80, height: 3, borderRadius: 2, marginTop: 3, background: 'var(--mantine-color-green-1)' }}>
                    <Box style={{ width: `${selectedSignal.confidence}%`, height: '100%', borderRadius: 2, background: 'var(--mantine-color-green-6)' }} />
                  </Box>
                </Box>
                <Box>
                  <Text fw={800} size="xl" c={selectedSignal.severityColor}>{selectedSignal.metricValue}</Text>
                  <Text size="10px" c="dimmed">{selectedSignal.metricStripLabel}</Text>
                  <Text size="10px" c="dimmed">{selectedSignal.metricSub}</Text>
                </Box>
                <Box>
                  <Text fw={800} size="xl" c={selectedSignal.precedentNote ? 'orange' : 'dark'}>
                    {selectedSignal.precedents}
                  </Text>
                  <Text size="10px" c="dimmed">Historical precedents</Text>
                  {selectedSignal.precedentNote && (
                    <Text size="10px" c="orange">{selectedSignal.precedentNote}</Text>
                  )}
                </Box>
              </Group>

              {/* Source + agent + date */}
              <Group gap="xs" mb="xs" wrap="wrap">
                <Badge size="xs" variant="outline" color="gray" style={{ fontFamily: 'monospace', fontSize: 9 }}>
                  {selectedSignal.sourceChip}
                </Badge>
                <Badge size="xs" variant="light" color="green">{selectedSignal.agent}</Badge>
                <Text size="10px" c="dimmed">{selectedSignal.date}</Text>
              </Group>

              {/* Signal tag chips */}
              {selectedSignal.tags && (
                <Group gap={6} mb="xs" wrap="wrap">
                  {selectedSignal.tags.map(tag => (
                    <Badge key={tag} size="xs" variant="light" color={selectedSignal.severityColor} style={{ letterSpacing: '0.03em' }}>
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}

              <Divider mb="xs" />

              {/* Trend chart */}
              <Group justify="space-between" mb={4}>
                <Text size="10px" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.07em' }}>
                  {selectedSignal.trendLabel}
                </Text>
                <Text size="10px" c={selectedSignal.severityColor} fw={700} style={{ letterSpacing: '0.04em' }}>
                  CURRENT: {selectedSignal.metricValue} {selectedSignal.metricUnit}
                </Text>
              </Group>
              <SignalTrendChart data={selectedSignal.trendData} color={selectedSignal.severityColor} unit={selectedSignal.metricUnit} />

              <Divider mt="xs" mb="xs" />

              {/* Signal detail */}
              <Text size="10px" c="dimmed" fw={700} tt="uppercase" mb={4} style={{ letterSpacing: '0.07em' }}>
                Signal Detail
              </Text>
              <Text size="xs" c="dimmed" mb="xs">{selectedSignal.detail || selectedSignal.description}</Text>

              {/* Response window */}
              <Text size="xs" c="dimmed" mb="md">
                <Text span fw={600} c="dark" size="xs">Response window: </Text>
                {selectedSignal.window}
              </Text>

              {/* Ready-to-run */}
              <Box style={{ background: 'var(--mantine-color-default-hover)', borderRadius: 8, padding: '10px 14px' }}>
                <Text size="10px" c="dimmed" mb={4}>Ready-to-run scenario</Text>
                <Group justify="space-between" align="center">
                  <Box>
                    <Text fw={700} size="sm">{selectedSignal.scenario}</Text>
                    <Text size="10px" c="dimmed">{selectedSignal.scenarioSub}</Text>
                  </Box>
                  <Button
                    size="xs"
                    color="vanguardRed"
                    radius="md"
                    leftSection={<IconPlayerPlay size={12} stroke={1.8} />}
                    onClick={() => handleRunSignalScenario(selectedSignal)}
                  >
                    Run scenario
                  </Button>
                </Group>
              </Box>
            </Card>
          )}
      </Group>
    </Stack>
  )
}
