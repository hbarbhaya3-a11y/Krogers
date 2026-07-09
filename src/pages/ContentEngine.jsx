import { useState } from 'react'
import { Paper, Stack, Group, Text, Badge, Select, Button, ThemeIcon, Divider, SimpleGrid, Table, Alert, Loader, Progress, Center } from '@mantine/core'
import { IconSparkles, IconCheck, IconShieldCheck, IconEye, IconEdit } from '@tabler/icons-react'
import { BarChart, LineChart } from '@mantine/charts'

const SIGNALS = [
  { value: 'advisory-gap', label: 'Store Service Risk — 126 Stores in Scope' },
  { value: 'idle-cash', label: 'Inventory Imbalance — 8 SKU Families in Scope' },
  { value: 'volatility', label: 'Premium Freight Risk — 27 At-Risk Loads in Scope' },
  { value: 'retirement', label: 'DC Capacity Stress — 4 DCs in Scope' },
]

const COHORT_PROFILES = [
  { value: 'planning-intent', label: 'Priority Store Clusters (service-risk)', description: 'Low inventory cover + delayed replenishment — responds to priority allocation & reroute' },
  { value: 'cash-heavy', label: 'Over-buffered Upstream / DC Nodes', description: 'Excess safety stock above policy — responds to MEIO right-sizing & de-duplication' },
  { value: 'volatility-rech', label: 'At-Risk Transport Lanes', description: 'ETA breach + carrier risk — responds to reroute & carrier swap' },
  { value: 'retirement-planner', label: 'High-variance Demand SKUs', description: 'Volatile demand/lead-time — responds to safety-stock uplift & reorder tuning' },
  { value: 'tax-seeker', label: 'Slow-mover SKU-locations', description: 'Low velocity, buffer buildup — responds to SKU-location rationalization' },
]

const PRODUCT_ANGLES = [
  { value: 'portfolio-review', label: 'MEIO Rebalance Playbook' },
  { value: 'digital-advisor', label: 'Priority Reroute Playbook' },
  { value: 'advisor-consult', label: 'Selective Expedite Playbook' },
  { value: 'tax-education', label: 'Allocation Resequencing Playbook' },
]

const SIGNAL_META = {
  'advisory-gap': { count: '126 stores', plans: '—', confidence: '87%', maturity: 'L3', critical: true },
  'idle-cash': { count: '8 SKU families', plans: '—', confidence: '89%', maturity: 'L3', critical: false },
  'volatility': { count: '27 loads', plans: '—', confidence: '84%', maturity: 'L2', critical: false },
  'retirement': { count: '4 DCs', plans: '—', confidence: '88%', maturity: 'L2', critical: false },
}

const DEMAND_SIGNALS = [
  { label: 'Priority Allocation & Reroute', severity: 'CRITICAL', count: 'Cluster 1 · 42 stores', delta: '+34% this week' },
  { label: 'MEIO Transfer / Rebalance', severity: 'HIGH', count: 'Cluster 2 · 6 SKU families', delta: '+28% this week' },
  { label: 'Carrier Swap / Reroute', severity: 'HIGH', count: 'Cluster 4 · 27 loads', delta: '+22% this week' },
  { label: 'Safety-Stock Uplift', severity: 'MEDIUM', count: 'Cluster 5 · 34 SKU-locations', delta: '+11% this week' },
  { label: 'SKU-Location Rationalization', severity: 'MEDIUM', count: 'Cluster 6 · 21 SKU-locations', delta: '+18% this week' },
]

const AUM_LIFT_DATA = [
  { name: 'MEIO Rebalance', aum: 8.4 },
  { name: 'Priority Reroute', aum: 6.2 },
  { name: 'Safety-Stock Uplift', aum: 5.1 },
  { name: 'Carrier Swap', aum: 3.8 },
  { name: 'Selective Expedite', aum: 2.6 },
  { name: 'Reorder Tuning', aum: 1.9 },
]

const CHANNEL_REACH_DATA = [
  { name: 'MEIO Rebalance', securesite: 4200, email: 3100, apppush: 1800 },
  { name: 'Priority Reroute', securesite: 2800, email: 2100, apppush: 3200 },
  { name: 'Safety-Stock', securesite: 3600, email: 2900, apppush: 1400 },
  { name: 'Carrier Swap', securesite: 1900, email: 3800, apppush: 900 },
  { name: 'Sel. Expedite', securesite: 5100, email: 2200, apppush: 1600 },
]

const ENGAGEMENT_TREND = [
  { month: 'Jan-26', treatment: 2800, holdout: 320 },
  { month: 'Feb-26', treatment: 3100, holdout: 290 },
  { month: 'Mar-26', treatment: 3400, holdout: 340 },
  { month: 'Apr-26', treatment: 3800, holdout: 310 },
  { month: 'May-26', treatment: 4200, holdout: 380 },
  { month: 'Jun-26', treatment: 5600, holdout: 410 },
]

const CONTENT_LIBRARY = [
  { title: 'MEIO Rebalance — Cross-Echelon Transfer', author: 'Inventory Planning', reach: '42 DCs', opens: '31 lanes', conversions: 218, aumLift: '$8.4M', compliance: 93, c2pa: true },
  { title: 'Priority Reroute — At-Risk Lanes', author: 'Transportation', reach: '27 loads', opens: '18 lanes', conversions: 132, aumLift: '$6.2M', compliance: 91, c2pa: true },
  { title: 'Safety-Stock Uplift — Priority SKUs', author: 'Replenishment', reach: '34 SKUs', opens: '21 nodes', conversions: 174, aumLift: '$5.1M', compliance: 88, c2pa: true },
  { title: 'Carrier Swap — Tender Acceptance', author: 'Transportation', reach: '19 loads', opens: '9 carriers', conversions: 74, aumLift: '$3.8M', compliance: 96, c2pa: false },
  { title: 'Selective Expedite — Unrecoverable Orders', author: 'Logistics Exception', reach: '12 loads', opens: '6 lanes', conversions: 96, aumLift: '$2.6M', compliance: 94, c2pa: true },
]

const SEVERITY_COLORS = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow' }

function KpiTile({ label, value, sub, color, icon: Icon }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group gap="sm" align="flex-start">
        <ThemeIcon size={36} radius="md" color={color} variant="light">
          <Icon size={20} stroke={1.5} />
        </ThemeIcon>
        <Stack gap={2}>
          <Text size="xs" c="dimmed">{label}</Text>
          <Text size="xl" fw={800} c={color}>{value}</Text>
          {sub && <Text size="xs" c="dimmed">{sub}</Text>}
        </Stack>
      </Group>
    </Paper>
  )
}

const GENERATE_LINES = [
  'Retrieving recovery priors from scenario library…',
  'Matching cohort risk-state to recovery playbooks…',
  'Assembling action packets for each execution workflow…',
  'Running feasibility & constraint check…',
  'Attaching decision-log provenance…',
  'Recovery actions ready — feasible, constraint-checked.',
]

function GeneratingState({ onDone }) {
  const [idx, setIdx] = useState(0)
  useState(() => {
    let i = 0
    const iv = setInterval(() => {
      i++; setIdx(i)
      if (i >= GENERATE_LINES.length - 1) { clearInterval(iv); setTimeout(onDone, 400) }
    }, 380)
    return () => clearInterval(iv)
  }, [])
  return (
    <Stack align="center" gap="md" py="xl">
      <Loader size="lg" color="orange" />
      <Stack gap="xs" align="center">
        <Text size="sm" fw={600}>Recovery Architect generating…</Text>
        {GENERATE_LINES.slice(0, idx + 1).map((line, i) => (
          <Group key={i} gap="xs">
            {i < idx
              ? <ThemeIcon size="xs" color="orange" radius="xl" variant="filled"><IconCheck size={8} /></ThemeIcon>
              : <Loader size="xs" color="orange" />}
            <Text size="xs" c={i < idx ? 'orange' : 'dimmed'}>{line}</Text>
          </Group>
        ))}
      </Stack>
      <Progress value={(idx / (GENERATE_LINES.length - 1)) * 100} color="orange" size="sm" w={300} animated />
    </Stack>
  )
}

function GeneratedContent({ signal, cohort, angle }) {
  const cohortObj = COHORT_PROFILES.find(c => c.value === cohort) || COHORT_PROFILES[0]
  return (
    <Stack gap="md">
      <Group gap="xs">
        <Badge color="green" variant="filled" size="sm">✓ Recovery actions generated</Badge>
        <Badge color="gray" variant="light" size="sm">Constraint-checked</Badge>
        <Badge color="teal" variant="light" size="sm">Decision-log provenance attached</Badge>
      </Group>
      <Divider />
      {[
        { variant: 'A', channel: 'WMS Transfer Order', headline: 'Cross-echelon MEIO rebalance', copy: 'Move available inventory from over-buffered upstream/DC nodes to priority stores where transfer viability is above threshold. Respects MOQ, store space, and transfer cycle time.' },
        { variant: 'B', channel: 'TMS Reroute', headline: 'Priority reroute of at-risk loads', copy: 'Route at-risk replenishment loads through feasible alternate lanes and eligible carriers within the service window. No new corridors; carrier eligibility enforced.' },
        { variant: 'C', channel: 'OMS Allocation', headline: 'Resequence constrained replenishment', copy: 'Push priority store/SKU combinations to the front of the allocation queue and raise reorder points for at-risk pairs. Planner approval required.' },
      ].map(v => (
        <Paper key={v.variant} withBorder p="sm" radius="md" style={{ borderLeft: `3px solid var(--mantine-color-${v.variant === 'A' ? 'teal' : v.variant === 'B' ? 'blue' : 'violet'}-5)` }}>
          <Stack gap="xs">
            <Group gap="xs">
              <Badge size="xs" color={v.variant === 'A' ? 'teal' : v.variant === 'B' ? 'blue' : 'violet'} variant="filled">Action {v.variant}</Badge>
              <Badge size="xs" color="gray" variant="outline">{v.channel}</Badge>
              <Badge size="xs" color="green" variant="light">Feasible</Badge>
            </Group>
            <Text size="sm" fw={700}>{v.headline}</Text>
            <Text size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>{v.copy}</Text>
          </Stack>
        </Paper>
      ))}
      <Alert color="teal" variant="light" icon={<IconShieldCheck size={14} />} p="xs">
        <Text size="xs">All actions constraint-checked · Feasibility ≥ threshold · Planner approval required · Decision-log provenance recorded</Text>
      </Alert>
    </Stack>
  )
}

import { IconSend, IconDatabase, IconChartBar, IconTrendingUp } from '@tabler/icons-react'

export default function ContentEngine() {
  const [signal, setSignal] = useState('advisory-gap')
  const [cohort, setCohort] = useState('planning-intent')
  const [angle, setAngle] = useState('portfolio-review')
  const [phase, setPhase] = useState('ready') // ready | generating | done
  const meta = SIGNAL_META[signal] || SIGNAL_META['advisory-gap']
  const cohortObj = COHORT_PROFILES.find(c => c.value === cohort) || COHORT_PROFILES[0]

  return (
    <Stack gap="md">
      <Stack gap={2}>
        <Text size="xl" fw={800} c="orange">Recovery Action Engine</Text>
        <Text size="sm" c="dimmed">Signal-driven recovery execution — from a supply-chain signal to multi-workflow action packets (TMS / WMS / OMS) with feasibility & constraint checks, planner approval, and service/inventory attribution on every action</Text>
      </Stack>

      <SimpleGrid cols={4} spacing="sm">
        <KpiTile label="Stores Reached (90d)" value="37K" color="orange" icon={IconSend} />
        <KpiTile label="Recovery Actions" value="919" sub="actions executed" color="teal" icon={IconTrendingUp} />
        <KpiTile label="Inventory Released" value="$31.8M" sub="attributed to actions" color="violet" icon={IconDatabase} />
        <KpiTile label="Avg Feasibility Score" value="93/100" color="green" icon={IconShieldCheck} />
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="md">
        {/* Left — Content Architect Brief */}
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Group gap="xs">
              <ThemeIcon size={24} radius="md" color="orange" variant="light">
                <IconEdit size={14} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} size="sm">Recovery Architect Brief</Text>
            </Group>

            <Stack gap="xs">
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Supply Chain Signal</Text>
              <Select data={SIGNALS} value={signal} onChange={v => { setSignal(v); setPhase('ready') }} />
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Store / SKU Cohort</Text>
              <Select data={COHORT_PROFILES.map(c => ({ value: c.value, label: c.label }))} value={cohort} onChange={v => { setCohort(v); setPhase('ready') }} />
              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>{cohortObj.description}</Text>
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Recovery Playbook</Text>
              <Select data={PRODUCT_ANGLES} value={angle} onChange={v => { setAngle(v); setPhase('ready') }} />
            </Stack>

            <Alert
              color={meta.critical ? 'red' : 'orange'}
              variant="light"
              p="sm"
            >
              <Stack gap={4}>
                <Badge size="xs" color={meta.critical ? 'red' : 'orange'} variant="filled">{meta.critical ? 'CRITICAL' : 'HIGH'}</Badge>
                <Group gap="xs">
                  <Text size="xs" c="dimmed">{meta.count} · cohort in scope</Text>
                </Group>
                <Group gap="xs">
                  <Text size="xs" c="dimmed">Confidence: {meta.confidence} · {meta.maturity} maturity</Text>
                </Group>
                <Text size="xs" c="dimmed">Recovery Architect will generate action packets grounded in this signal</Text>
              </Stack>
            </Alert>

            <Button
              leftSection={<IconSparkles size={14} />}
              color="orange"
              onClick={() => setPhase('generating')}
              disabled={phase === 'generating'}
            >
              Generate Recovery Actions
            </Button>
          </Stack>
        </Paper>

        {/* Right — generated content or placeholder */}
        <Paper withBorder p="md" radius="md" style={{ minHeight: 420 }}>
          {phase === 'ready' && (
            <Center h={380}>
              <Stack align="center" gap="sm">
                <ThemeIcon size={48} radius="xl" variant="light" color="orange">
                  <IconSparkles size={24} stroke={1.5} />
                </ThemeIcon>
                <Text fw={600} size="sm">Recovery Architect ready</Text>
                <Text size="xs" c="dimmed" ta="center" maw={260}>
                  Select a signal and store/SKU cohort, then click Generate Recovery Actions to create constraint-checked action packets across TMS, WMS, and OMS workflows.
                </Text>
              </Stack>
            </Center>
          )}
          {phase === 'generating' && <GeneratingState onDone={() => setPhase('done')} />}
          {phase === 'done' && <GeneratedContent signal={signal} cohort={cohort} angle={angle} />}
        </Paper>
      </SimpleGrid>

      {/* Analytics section */}
      <Stack gap="xs">
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Recovery Action Performance & Analytics</Text>
        <SimpleGrid cols={2} spacing="md">
          {/* Demand signals */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="sm">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Recovery Action Demand Signals</Text>
              {DEMAND_SIGNALS.map((s, i) => (
                <Group key={i} justify="space-between" align="center">
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Text size="xs" fw={600}>{s.label}</Text>
                      <Badge size="xs" color={SEVERITY_COLORS[s.severity]} variant="light">{s.severity}</Badge>
                    </Group>
                    <Text size="xs" c="dimmed">{s.count}</Text>
                  </Stack>
                  <Text size="xs" c="green" fw={600}>{s.delta}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>

          {/* AUM lift chart */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Inventory Released Per Recovery Action (90d · $M)</Text>
              <BarChart
                h={200}
                data={AUM_LIFT_DATA}
                dataKey="name"
                series={[{ name: 'aum', color: 'orange', label: 'Released ($M)' }]}
                tickLine="none"
                gridAxis="x"
              />
            </Stack>
          </Paper>

          {/* Channel reach */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Workflow Reach by Recovery Action</Text>
              <BarChart
                h={200}
                data={CHANNEL_REACH_DATA}
                dataKey="name"
                series={[
                  { name: 'securesite', color: 'teal', label: 'TMS Reroute' },
                  { name: 'email', color: 'orange', label: 'MEIO Transfer' },
                  { name: 'apppush', color: 'violet', label: 'OMS Allocation' },
                ]}
                type="stacked"
                tickLine="none"
                gridAxis="x"
              />
            </Stack>
          </Paper>

          {/* Engagement trend */}
          <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Recovery Action Execution Trend — 6 Months</Text>
              <LineChart
                h={200}
                data={ENGAGEMENT_TREND}
                dataKey="month"
                series={[
                  { name: 'treatment', color: 'teal', label: 'Treatment' },
                  { name: 'holdout', color: 'orange', label: 'Holdout' },
                ]}
                tickLine="none"
                gridAxis="x"
              />
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>

      {/* Content library table */}
      <Paper withBorder radius="md" p="md">
        <Stack gap="sm">
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Kroger Recovery Playbook Library — Performance</Text>
          <Table striped highlightOnHover withTableBorder fz="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Playbook</Table.Th>
                <Table.Th>Owner</Table.Th>
                <Table.Th>Nodes</Table.Th>
                <Table.Th>Lanes</Table.Th>
                <Table.Th>Recovered</Table.Th>
                <Table.Th>Inventory</Table.Th>
                <Table.Th>Feasibility</Table.Th>
                <Table.Th>Audited</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {CONTENT_LIBRARY.map((row, i) => (
                <Table.Tr key={i}>
                  <Table.Td fw={600}>{row.title}</Table.Td>
                  <Table.Td c="dimmed">{row.author}</Table.Td>
                  <Table.Td>{row.reach}</Table.Td>
                  <Table.Td>{row.opens}</Table.Td>
                  <Table.Td c="green" fw={600}>{row.conversions}</Table.Td>
                  <Table.Td c="violet" fw={600}>{row.aumLift}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Progress value={row.compliance} color={row.compliance >= 90 ? 'green' : 'orange'} size="xs" w={40} />
                      <Text size="xs" c={row.compliance >= 90 ? 'green' : 'orange'} fw={600}>{row.compliance}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="xs" color={row.c2pa ? 'teal' : 'gray'} variant={row.c2pa ? 'filled' : 'outline'}>
                      {row.c2pa ? 'AUDITED' : 'MANUAL'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </Stack>
  )
}
