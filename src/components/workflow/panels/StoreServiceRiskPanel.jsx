import { useState, useEffect } from 'react'
import {
  Paper, Stack, Group, Text, Badge, SimpleGrid, Progress, Divider, Button,
  ThemeIcon, SegmentedControl, Slider, Checkbox, Table, Alert, Loader, Center, Box,
} from '@mantine/core'
import {
  IconRadar, IconTargetArrow, IconAdjustments, IconChartBar, IconTrophy,
  IconShieldCheck, IconDeviceFloppy, IconCheck, IconChevronRight, IconRefresh,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { useUseCase } from '../../../contexts/UseCaseContext'
import {
  SSR_LEVERS, SSR_RECOMMENDED_DEFAULTS, SSR_KPIS, SSR_OBJECTIVES,
  SSR_PLANS, SSR_EXECUTION_ITEMS, SSR_LOADING_LINES,
} from '../../../data/storeServiceRisk'

const pct = (n, d = 1) => `${n >= 0 ? '' : ''}${n.toFixed(d)}`

// ── Loading transition — new supply-chain context per screen ────────────────
function useLoadingPhase(lines) {
  const [phase, setPhase] = useState('loading')
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setPhase('loading'); setIdx(0)
    const iv = setInterval(() => {
      setIdx(i => {
        if (i >= lines.length - 1) { clearInterval(iv); setTimeout(() => setPhase('ready'), 300); return i }
        return i + 1
      })
    }, 320)
    return () => clearInterval(iv)
  }, [lines])
  return { phase, idx }
}

function LoadingScreen({ lines, idx, color = 'orange' }) {
  return (
    <Paper withBorder p="xl" radius="md">
      <Stack align="center" gap="lg" py="xl">
        <Loader size="lg" color={color} />
        <Stack gap="xs" align="center">
          {lines.slice(0, idx + 1).map((line, i) => (
            <Group key={i} gap="xs">
              {i < idx
                ? <ThemeIcon size="xs" color={color} radius="xl" variant="filled"><IconCheck size={8} /></ThemeIcon>
                : <Loader size="xs" color={color} />}
              <Text size="xs" c={i < idx ? color : 'dimmed'}>{line}</Text>
            </Group>
          ))}
        </Stack>
        <Progress value={(idx / (lines.length - 1)) * 100} color={color} size="sm" w={300} animated />
      </Stack>
    </Paper>
  )
}

function ContinueButton({ onClick, label = 'Continue', icon }) {
  return (
    <Button
      size="md" variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 135 }}
      rightSection={icon || <IconChevronRight size={16} stroke={2} />}
      onClick={onClick} style={{ alignSelf: 'flex-end' }}
    >
      {label}
    </Button>
  )
}

// ── Deterministic projection from lever settings (Screen 4) ─────────────────
function project(levers) {
  const alloc = { 'Service-first': 1.2, 'Balanced': 0.6, 'Cost-first': 0 }[levers.allocationPriority] ?? 0.6
  const meio = { 'Aggressive': 1.0, 'Balanced': 0.6, 'Conservative': 0.2 }[levers.meioRebalance] ?? 0.6
  const service = Math.min(98.5, 94.2 + levers.rerouteScope * 0.02 + levers.expediteCap * 0.03 + levers.safetyStockUplift * 0.06 + alloc + meio)
  const stockout = Math.max(1.8, 8.5 - levers.safetyStockUplift * 0.18 - levers.rerouteScope * 0.02 - meio * 1.4)
  const premium = Math.max(0.45, 0.55 + levers.expediteCap * 0.028)
  const recovery = { '24 hr': 26, '48 hr': 36, '72 hr': 52 }[levers.recoveryWindow] ?? 36
  return { service, stockout, premium, recovery }
}

export default function StoreServiceRiskPanel({ step, workflowState, setWorkflowState, onContinue, onApprove }) {
  const { exit } = useUseCase()
  const screen = step.panelData?.screen ?? 1
  const lines = SSR_LOADING_LINES[screen] || ['Loading…']
  const { phase, idx } = useLoadingPhase(lines)

  const levers = workflowState.ssrLevers ?? SSR_RECOMMENDED_DEFAULTS
  const setLever = (id, v) => setWorkflowState(s => ({ ...s, ssrLevers: { ...(s.ssrLevers ?? SSR_RECOMMENDED_DEFAULTS), [id]: v } }))
  const resetLevers = () => setWorkflowState(s => ({ ...s, ssrLevers: { ...SSR_RECOMMENDED_DEFAULTS } }))
  const selectedPlanId = workflowState.ssrPlanId ?? 'balanced'
  const selectedPlan = SSR_PLANS.find(p => p.id === selectedPlanId) || SSR_PLANS[1]

  if (phase === 'loading') return <LoadingScreen lines={lines} idx={idx} />

  // ── Screen 1 — Signal Analysis ────────────────────────────────────────────
  if (screen === 1) {
    const tiles = [
      { label: 'Stores at risk', value: '126', color: 'orange' },
      { label: 'Service attainment', value: '94.2%', color: 'red' },
      { label: 'Stockout probability', value: '8.5%', color: 'orange' },
      { label: 'Model confidence', value: '87%', color: 'green' },
    ]
    return (
      <Stack gap="md">
        <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-orange-5)' }}>
          <Group gap="xs" mb="xs">
            <Badge color="teal" variant="filled" size="sm">SENSE</Badge>
            <Badge color="orange" variant="filled" size="sm">HIGH</Badge>
            <Badge color="gray" variant="outline" size="sm">OMS / INVENTORY FEED</Badge>
          </Group>
          <Text fw={800} size="lg" mb={4}>Store Service Risk — At-Risk Replenishment Orders</Text>
          <Text size="sm" c="dimmed">Delayed replenishment and low inventory cover indicate rising service risk across priority store/SKU combinations. TwinX connects transportation delays with inventory posture before recommending recovery actions.</Text>
        </Paper>
        <SimpleGrid cols={4} spacing="sm">
          {tiles.map(t => (
            <Paper key={t.label} withBorder p="md" radius="md">
              <Text fw={800} size="xl" c={t.color}>{t.value}</Text>
              <Text size="xs" c="dimmed">{t.label}</Text>
            </Paper>
          ))}
        </SimpleGrid>
        <Group gap={6} wrap="wrap">
          {['STORE SERVICE RISK', 'LOW INVENTORY COVER', 'DELAYED REPLENISHMENT', 'STOCKOUT PROBABILITY', 'SERVICE SENTINEL'].map(t => (
            <Badge key={t} size="xs" variant="light" color="orange">{t}</Badge>
          ))}
        </Group>
        <Alert color="orange" variant="light" icon={<IconAlertTriangle size={14} />} p="xs">
          <Text size="xs">126 stores at risk · 5 historical precedents · 24–72 hr service window. Recovery levers: MEIO rebalance, allocation resequencing, transportation reroute, selective expedited logistics.</Text>
        </Alert>
        <ContinueButton onClick={onContinue} label="Continue to Objectives" />
      </Stack>
    )
  }

  // ── Screen 2 — Objectives & KPIs ──────────────────────────────────────────
  if (screen === 2) {
    const objState = workflowState.ssrObjectives ?? Object.fromEntries(SSR_OBJECTIVES.map(o => [o.id, o.recommended]))
    const toggleObj = (id) => setWorkflowState(s => {
      const cur = s.ssrObjectives ?? Object.fromEntries(SSR_OBJECTIVES.map(o => [o.id, o.recommended]))
      return { ...s, ssrObjectives: { ...cur, [id]: !cur[id] } }
    })
    return (
      <Stack gap="md">
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="sm" mb="xs"><IconTargetArrow size={14} style={{ verticalAlign: -2 }} /> Recovery objectives</Text>
          <Stack gap="xs">
            {SSR_OBJECTIVES.map(o => (
              <Checkbox
                key={o.id} checked={!!objState[o.id]} onChange={() => toggleObj(o.id)} color="orange"
                label={<span><Text span fw={600} size="sm">{o.label}</Text>{o.recommended && <Badge ml={6} size="xs" color="green" variant="light">recommended</Badge>}<Text size="xs" c="dimmed">{o.desc}</Text></span>}
              />
            ))}
          </Stack>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="sm" mb="xs"><IconChartBar size={14} style={{ verticalAlign: -2 }} /> KPI targets — baseline vs target</Text>
          <Table fz="xs" withTableBorder withColumnBorders>
            <Table.Thead><Table.Tr><Table.Th>KPI</Table.Th><Table.Th>Baseline</Table.Th><Table.Th>Target</Table.Th><Table.Th>Direction</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {SSR_KPIS.map(k => (
                <Table.Tr key={k.id}>
                  <Table.Td fw={600}>{k.label}</Table.Td>
                  <Table.Td>{k.baseline}{k.unit}</Table.Td>
                  <Table.Td c="green" fw={700}>{k.target}{k.unit}</Table.Td>
                  <Table.Td><Badge size="xs" color={k.dir === 'up' ? 'green' : 'blue'} variant="light">{k.dir === 'up' ? 'higher is better' : 'lower is better'}</Badge></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
        <ContinueButton onClick={onContinue} label="Continue to Levers" />
      </Stack>
    )
  }

  // ── Screen 3 — Simulation Levers (recommended defaults) ───────────────────
  if (screen === 3) {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700} size="sm"><IconAdjustments size={14} style={{ verticalAlign: -2 }} /> Simulation levers</Text>
          <Button size="xs" variant="light" color="gray" leftSection={<IconRefresh size={12} />} onClick={resetLevers}>Reset to recommended</Button>
        </Group>
        <Alert color="green" variant="light" p="xs"><Text size="xs">All levers are pre-set to their <b>recommended</b> values. Adjust any lever to explore alternatives, then run the simulation.</Text></Alert>
        <Stack gap="md">
          {SSR_LEVERS.map(l => (
            <Paper key={l.id} withBorder p="sm" radius="md">
              <Group justify="space-between" mb={4}>
                <Text size="sm" fw={600}>{l.label}</Text>
                <Badge size="xs" color={levers[l.id] === l.recommended ? 'green' : 'orange'} variant="light">
                  {levers[l.id] === l.recommended ? 'recommended' : 'custom'}: {levers[l.id]}{l.type === 'slider' ? l.unit : ''}
                </Badge>
              </Group>
              <Text size="xs" c="dimmed" mb="xs">{l.help}</Text>
              {l.type === 'segmented' ? (
                <SegmentedControl fullWidth size="xs" color="orange" data={l.options} value={levers[l.id]} onChange={v => setLever(l.id, v)} />
              ) : (
                <Slider color="orange" min={l.min} max={l.max} step={l.step} value={levers[l.id]}
                  onChange={v => setLever(l.id, v)} label={v => `${v}${l.unit}`}
                  marks={[{ value: l.recommended, label: 'rec' }]} />
              )}
            </Paper>
          ))}
        </Stack>
        <ContinueButton onClick={onContinue} label="Run Simulation" icon={<IconChartBar size={16} />} />
      </Stack>
    )
  }

  // ── Screen 4 — Simulation Summary ─────────────────────────────────────────
  if (screen === 4) {
    const p = project(levers)
    const doNothing = { service: 91.0, stockout: 12.4, premium: 0.55, recovery: 96 }
    const rows = [
      { label: 'Service attainment', unit: '%', plan: p.service, base: doNothing.service, up: true },
      { label: 'Stockout probability', unit: '%', plan: p.stockout, base: doNothing.stockout, up: false },
      { label: 'Premium freight cost', unit: '$M', plan: p.premium, base: doNothing.premium, up: false },
      { label: 'Recovery time', unit: 'hr', plan: p.recovery, base: doNothing.recovery, up: false },
    ]
    return (
      <Stack gap="md">
        <Alert color="violet" variant="light" p="xs"><Text size="xs">Projected outcomes from your lever settings vs the <b>do-nothing baseline</b> (first-class option). Monte-Carlo over demand + ETA uncertainty.</Text></Alert>
        <SimpleGrid cols={2} spacing="sm">
          {rows.map(r => {
            const better = r.up ? r.plan > r.base : r.plan < r.base
            return (
              <Paper key={r.label} withBorder p="md" radius="md">
                <Text size="xs" c="dimmed" mb={2}>{r.label}</Text>
                <Group gap="xs" align="flex-end">
                  <Text fw={800} size="xl" c={better ? 'green' : 'orange'}>{r.unit === '$M' ? `$${r.plan.toFixed(2)}M` : `${r.plan.toFixed(r.unit === 'hr' ? 0 : 1)}${r.unit === 'hr' ? ' hr' : r.unit}`}</Text>
                  <Text size="xs" c="dimmed" mb={3}>vs {r.unit === '$M' ? `$${r.base.toFixed(2)}M` : `${r.base}${r.unit === 'hr' ? ' hr' : r.unit}`} do-nothing</Text>
                </Group>
              </Paper>
            )
          })}
        </SimpleGrid>
        <ContinueButton onClick={onContinue} label="See Optimization Results" icon={<IconTrophy size={16} />} />
      </Stack>
    )
  }

  // ── Screen 5 — Optimization Results ───────────────────────────────────────
  if (screen === 5) {
    return (
      <Stack gap="md">
        <Text fw={700} size="sm"><IconTrophy size={14} style={{ verticalAlign: -2 }} /> Ranked recovery plans</Text>
        <SimpleGrid cols={3} spacing="sm">
          {SSR_PLANS.map(pl => {
            const sel = pl.id === selectedPlanId
            return (
              <Paper key={pl.id} withBorder p="md" radius="md"
                onClick={() => setWorkflowState(s => ({ ...s, ssrPlanId: pl.id }))}
                style={{ cursor: 'pointer', borderColor: sel ? `var(--mantine-color-${pl.tone}-6)` : undefined, background: sel ? `var(--mantine-color-${pl.tone}-light)` : undefined }}>
                <Group justify="space-between" mb={4}>
                  <Text fw={700} size="sm">{pl.name}</Text>
                  {pl.recommended && <Badge size="xs" color="green" variant="filled">recommended</Badge>}
                </Group>
                <Text size="xs" c="dimmed" mb="sm">{pl.summary}</Text>
                <Stack gap={2}>
                  <Text size="xs">Service: <b>{pl.service}%</b></Text>
                  <Text size="xs">Stockout: <b>{pl.stockout}%</b></Text>
                  <Text size="xs">Premium freight: <b>${pl.premium.toFixed(2)}M</b></Text>
                  <Text size="xs">Recovery: <b>{pl.recovery} hr</b></Text>
                </Stack>
                {sel && <Badge mt="sm" size="xs" color={pl.tone} variant="light" leftSection={<IconCheck size={10} />}>Selected</Badge>}
              </Paper>
            )
          })}
        </SimpleGrid>
        <ContinueButton onClick={onContinue} label="Continue to Approval" icon={<IconShieldCheck size={16} />} />
      </Stack>
    )
  }

  // ── Screen 6 — Approval & Execution ───────────────────────────────────────
  if (screen === 6) {
    return (
      <Stack gap="md">
        <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-yellow-6)' }}>
          <Group gap="xs" mb="xs"><Badge color="yellow" variant="filled" size="sm">EXECUTE</Badge><Text fw={700} size="sm">Approval & Execution</Text></Group>
          <Text size="sm" c="dimmed">Selected plan: <b>{selectedPlan.name}</b> — {selectedPlan.summary}</Text>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="sm" mb="xs">Execution package</Text>
          <Stack gap="xs">
            {SSR_EXECUTION_ITEMS.map(it => (
              <Group key={it.id} justify="space-between">
                <Group gap="xs"><ThemeIcon size="sm" color="green" variant="light" radius="xl"><IconCheck size={12} /></ThemeIcon><Text size="xs">{it.label}</Text></Group>
                <Badge size="xs" color="gray" variant="outline">{it.count}</Badge>
              </Group>
            ))}
          </Stack>
        </Paper>
        <Button size="md" color="green" leftSection={<IconShieldCheck size={16} />} style={{ alignSelf: 'flex-end' }}
          onClick={() => onApprove?.('Approved — Store Service Risk recovery')}>
          Approve & Execute
        </Button>
      </Stack>
    )
  }

  // ── Screen 7 — Learn & Save Scenario ──────────────────────────────────────
  const saved = workflowState.ssrSaved
  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-grape-6)' }}>
        <Group gap="xs" mb="xs"><Badge color="grape" variant="filled" size="sm">LEARN</Badge><Text fw={700} size="sm">Learn & Save Scenario</Text></Group>
        <Text size="sm" c="dimmed">Recovery executed with the <b>{selectedPlan.name}</b> plan. TwinX recorded the levers, outcomes, and precedents to the scenario library for reuse and continuous learning.</Text>
      </Paper>
      <SimpleGrid cols={3} spacing="sm">
        <Paper withBorder p="md" radius="md"><Text fw={800} size="xl" c="green">{selectedPlan.service}%</Text><Text size="xs" c="dimmed">Service attainment</Text></Paper>
        <Paper withBorder p="md" radius="md"><Text fw={800} size="xl" c="blue">{selectedPlan.stockout}%</Text><Text size="xs" c="dimmed">Stockout probability</Text></Paper>
        <Paper withBorder p="md" radius="md"><Text fw={800} size="xl" c="orange">${selectedPlan.premium.toFixed(2)}M</Text><Text size="xs" c="dimmed">Premium freight cost</Text></Paper>
      </SimpleGrid>
      <Group justify="flex-end" gap="sm">
        <Button variant="light" color="grape" leftSection={<IconDeviceFloppy size={16} />}
          onClick={() => setWorkflowState(s => ({ ...s, ssrSaved: true }))} disabled={saved}>
          {saved ? 'Saved to library' : 'Save scenario'}
        </Button>
        <Button color="green" leftSection={<IconCheck size={16} />} onClick={exit}>Finish</Button>
      </Group>
    </Stack>
  )
}
