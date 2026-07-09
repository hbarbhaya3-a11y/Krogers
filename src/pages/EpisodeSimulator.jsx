import { useState } from 'react'
import { Paper, Stack, Group, Text, Badge, Select, Slider, SegmentedControl, Button, ThemeIcon, Divider, SimpleGrid, Progress, Alert, Tabs, Center, Loader } from '@mantine/core'
import { IconPlayerPlay, IconSparkles, IconRadar, IconBrain, IconChartBar, IconShieldCheck, IconCheck, IconClock, IconTarget } from '@tabler/icons-react'
import { BarChart } from '@mantine/charts'

const EPISODES = [
  { value: 'advisory-gap', label: 'Store Service Protection — June 2026' },
  { value: 'idle-cash', label: 'MEIO Inventory Rebalance — Q2 2026' },
  { value: 'volatility', label: 'Premium Freight Avoidance — Apr 2026' },
  { value: 'retirement-income', label: 'DC Capacity Shift — Q3 2026' },
  { value: 'custom', label: 'Custom scenario…' },
]

const COHORTS = [
  { value: 'all', label: 'All Store / SKU Cohorts' },
  { value: 'planning-intent', label: 'Priority Store Clusters (service-risk)' },
  { value: 'cash-heavy', label: 'Over-buffered Upstream / DC Nodes' },
  { value: 'volatility', label: 'High-variance Demand SKUs' },
  { value: 'retirement', label: 'Slow-mover SKU-locations' },
  { value: 'tax', label: 'Fresh / Aging-sensitive SKUs' },
]

const OBJECTIVES = [
  { value: 'advisory', label: 'Maximise Service Attainment / In-Stock' },
  { value: 'aum', label: 'Minimise Total Network Inventory' },
  { value: 'cash', label: 'Minimise Premium Freight Spend' },
  { value: 'retention', label: 'Minimise Recovery Time / TTR' },
]

const SIM_RESULTS = {
  'advisory-gap': {
    p50Engagement: 11.6,
    p5Engagement: 8.2,
    p95Engagement: 15.1,
    p50AUM: 31.8,
    p5AUM: 22.4,
    p95AUM: 43.1,
    advisoryStarts: 440,
    confidence: 0.87,
    scenarioBars: [
      { scenario: 'Scenario A\n(Recommended)', p50: 11.6, p5: 8.2, p95: 15.1 },
      { scenario: 'Scenario B', p50: 14.8, p5: 9.1, p95: 19.4 },
      { scenario: 'Scenario C', p50: 7.2, p5: 5.1, p95: 9.8 },
      { scenario: 'Do Nothing', p50: 3.0, p5: 1.8, p95: 4.2 },
    ],
    aumBars: [
      { scenario: 'Scenario A', aum: 31.8 },
      { scenario: 'Scenario B', aum: 51.2 },
      { scenario: 'Scenario C', aum: 16.4 },
      { scenario: 'Do Nothing', aum: 0 },
    ],
  },
  'idle-cash': {
    p50Engagement: 9.4,
    p5Engagement: 6.1,
    p95Engagement: 13.2,
    p50AUM: 24.3,
    p5AUM: 16.8,
    p95AUM: 34.7,
    advisoryStarts: 218,
    confidence: 0.88,
    scenarioBars: [
      { scenario: 'Scenario A', p50: 9.4, p5: 6.1, p95: 13.2 },
      { scenario: 'Scenario B', p50: 12.8, p5: 8.4, p95: 17.1 },
      { scenario: 'Scenario C', p50: 6.2, p5: 4.0, p95: 8.6 },
      { scenario: 'Do Nothing', p50: 2.1, p5: 1.2, p95: 3.4 },
    ],
    aumBars: [
      { scenario: 'Scenario A', aum: 24.3 },
      { scenario: 'Scenario B', aum: 38.1 },
      { scenario: 'Scenario C', aum: 11.2 },
      { scenario: 'Do Nothing', aum: 0 },
    ],
  },
}

function SimResults({ episode, iterations }) {
  const data = SIM_RESULTS[episode] || SIM_RESULTS['advisory-gap']
  return (
    <Stack gap="md">
      <Group gap="xs">
        <Badge color="green" variant="filled" size="sm">✓ Simulation complete</Badge>
        <Badge color="gray" variant="light" size="sm">{iterations} iterations</Badge>
        <Badge color="violet" variant="light" size="sm">P5 / P50 / P95 CIs</Badge>
      </Group>

      <SimpleGrid cols={3} spacing="sm">
        {[
          { label: 'P50 Service Uplift', value: `+${data.p50Engagement} pts`, sub: `P5: +${data.p5Engagement} · P95: +${data.p95Engagement}`, color: 'teal' },
          { label: 'P50 Inventory Released', value: `$${data.p50AUM}M`, sub: `P5: $${data.p5AUM}M · P95: $${data.p95AUM}M`, color: 'violet' },
          { label: 'Stores Recovered (projected)', value: `+${data.advisoryStarts}`, sub: `vs do-nothing baseline`, color: 'orange' },
        ].map(k => (
          <Paper key={k.label} withBorder p="sm" radius="md">
            <Stack gap={2}>
              <Text size="xs" c="dimmed">{k.label}</Text>
              <Text size="xl" fw={800} c={k.color}>{k.value}</Text>
              <Text size="xs" c="dimmed">{k.sub}</Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <Paper withBorder p="sm" radius="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">Service uplift by scenario (P50)</Text>
            <Badge size="xs" color="teal" variant="light">Service Δ pts</Badge>
          </Group>
          <BarChart
            h={160}
            data={data.scenarioBars}
            dataKey="scenario"
            series={[
              { name: 'p50', color: 'teal', label: 'P50' },
              { name: 'p95', color: 'teal.2', label: 'P95' },
            ]}
            tickLine="none"
            gridAxis="x"
          />
        </Stack>
      </Paper>

      <Paper withBorder p="sm" radius="md">
        <Stack gap="xs">
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">Projected inventory released by scenario ($M)</Text>
          <BarChart
            h={140}
            data={data.aumBars}
            dataKey="scenario"
            series={[{ name: 'aum', color: 'violet', label: 'Released ($M)' }]}
            tickLine="none"
            gridAxis="x"
          />
        </Stack>
      </Paper>

      <Group justify="space-between">
        <Stack gap={2}>
          <Text size="xs" fw={600}>Model confidence</Text>
          <Group gap="xs">
            <Progress value={data.confidence * 100} color="teal" size="sm" radius="sm" w={160} />
            <Text size="xs" c="teal" fw={700}>{Math.round(data.confidence * 100)}%</Text>
          </Group>
        </Stack>
        <Alert color="teal" variant="light" icon={<IconShieldCheck size={14} />} p="xs">
          <Text size="xs">Scenario A recommended — best confidence/cost ratio</Text>
        </Alert>
      </Group>
    </Stack>
  )
}

function RunningState({ onDone }) {
  const [lineIdx, setLineIdx] = useState(0)
  const LINES = [
    'Loading scenario priors from library…',
    'Sampling demand & lead-time distributions…',
    'Running 1,000 TwinX simulation iterations…',
    'Computing P5 / P50 / P95 confidence intervals…',
    'Generating scenario comparison…',
  ]
  useState(() => {
    let idx = 0
    const iv = setInterval(() => {
      idx++
      setLineIdx(idx)
      if (idx >= LINES.length - 1) { clearInterval(iv); setTimeout(onDone, 400) }
    }, 380)
    return () => clearInterval(iv)
  }, [])
  return (
    <Stack align="center" gap="lg" py="xl">
      <Loader size="lg" color="violet" />
      <Stack gap="xs" align="center">
        <Text size="sm" fw={600}>Running TwinX simulation…</Text>
        {LINES.slice(0, lineIdx + 1).map((line, i) => (
          <Group key={i} gap="xs">
            {i < lineIdx
              ? <ThemeIcon size="xs" color="violet" radius="xl" variant="filled"><IconCheck size={8} /></ThemeIcon>
              : <Loader size="xs" color="violet" />}
            <Text size="xs" c={i < lineIdx ? 'violet' : 'dimmed'}>{line}</Text>
          </Group>
        ))}
      </Stack>
      <Progress value={(lineIdx / (LINES.length - 1)) * 100} color="violet" size="sm" w={300} animated />
    </Stack>
  )
}

export default function EpisodeSimulator() {
  const [episode, setEpisode] = useState('advisory-gap')
  const [cohort, setCohort] = useState('all')
  const [objective, setObjective] = useState('advisory')
  const [iterations, setIterations] = useState('1,000')
  const [channels, setChannels] = useState({ email: 35, securesite: 45, apppush: 15, advisor: 5 })
  const [phase, setPhase] = useState('config') // config | running | results

  const handleRun = () => { setPhase('running') }

  return (
    <Stack gap="md">
      <Group gap="xs">
        <Text size="xl" fw={800}>Scenario Simulator</Text>
        <Badge color="violet" variant="light">TwinX</Badge>
      </Group>
      <Text size="sm" c="dimmed">Risk-free simulation of supply-chain recovery scenarios — model service attainment, inventory release, and recovery outcomes before committing to execution</Text>

      <SimpleGrid cols={2} spacing="md">
        {/* Left — config panel */}
        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Select Scenario</Text>
              <Text size="xs" c="dimmed">Choose a historical scenario or configure custom</Text>
              <Select data={EPISODES} value={episode} onChange={v => { setEpisode(v); setPhase('config') }} />
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Target Store / SKU Cohort</Text>
              <Select data={COHORTS} value={cohort} onChange={setCohort} />
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Recovery Action Mix</Text>
              {[
                { key: 'email', label: 'MEIO Transfer', color: '#E03131' },
                { key: 'securesite', label: 'Priority Reroute', color: '#E03131' },
                { key: 'apppush', label: 'Allocation Resequence', color: '#E03131' },
                { key: 'advisor', label: 'Selective Expedite', color: '#E03131' },
              ].map(ch => (
                <Group key={ch.key} gap="sm" align="center">
                  <Text size="xs" w={120} style={{ flexShrink: 0 }}>{ch.label}</Text>
                  <Slider
                    value={channels[ch.key]}
                    onChange={v => setChannels(c => ({ ...c, [ch.key]: v }))}
                    color="red"
                    size="xs"
                    style={{ flex: 1 }}
                    min={0} max={100}
                  />
                  <Text size="xs" w={32} ta="right" fw={600}>{channels[ch.key]}%</Text>
                </Group>
              ))}
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Iterations</Text>
              <SegmentedControl
                value={iterations}
                onChange={setIterations}
                data={['100 (fast)', '500', '1,000']}
                size="xs"
              />
            </Stack>

            <Stack gap="xs">
              <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.05em' }}>Primary Objective</Text>
              <Select data={OBJECTIVES} value={objective} onChange={setObjective} />
            </Stack>

            <Button
              leftSection={<IconPlayerPlay size={14} />}
              color="vanguardRed"
              onClick={handleRun}
              disabled={phase === 'running'}
            >
              Run Simulation ({iterations} iterations)
            </Button>
          </Stack>
        </Paper>

        {/* Right — results panel */}
        <Paper withBorder p="md" radius="md" style={{ minHeight: 460 }}>
          {phase === 'config' && (
            <Center h={400}>
              <Stack align="center" gap="sm">
                <ThemeIcon size={48} radius="xl" variant="light" color="violet">
                  <IconTarget size={24} stroke={1.5} />
                </ThemeIcon>
                <Text fw={600} size="sm">Configure scenario and run simulation to see results</Text>
                <Text size="xs" c="dimmed">P5 / P50 / P95 confidence intervals · 1,000 iterations · scenario comparison</Text>
              </Stack>
            </Center>
          )}
          {phase === 'running' && <RunningState onDone={() => setPhase('results')} />}
          {phase === 'results' && <SimResults episode={episode} iterations={iterations} />}
        </Paper>
      </SimpleGrid>
    </Stack>
  )
}
