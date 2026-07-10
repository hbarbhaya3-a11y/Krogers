// Shared supply-chain visualization primitives used across UC1 (Network
// Resilience / Store Service Risk) and UC2 (MEIO Inventory Imbalance).
import { Paper, Stack, Group, Text, Badge, SimpleGrid, ThemeIcon, Box, Progress } from '@mantine/core'
import { IconBuildingWarehouse, IconBuildingStore, IconTruck, IconAlertTriangle } from '@tabler/icons-react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell,
} from 'recharts'

const NODE_COLORS = { supplier: 'blue', dc: 'violet', store: 'teal' }

// ── Network map — supplier → DC → store nodes + lanes ───────────────────────
// nodes: [{ id, type, x, y (0..100), label, impacted }]
// lanes: [{ from, to, status: 'ok'|'at-risk'|'rerouted' }]
export function NetworkMap({ nodes, lanes = [], height = 230 }) {
  const W = 680, H = 240
  const px = x => 44 + (x / 100) * (W - 88)
  const py = y => 28 + (y / 100) * (H - 64)
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]))
  const laneColor = { ok: 'var(--mantine-color-gray-4)', 'at-risk': 'var(--mantine-color-orange-6)', rerouted: 'var(--mantine-color-green-6)' }
  return (
    <Box>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {lanes.map((l, i) => {
          const a = byId[l.from], b = byId[l.to]
          if (!a || !b) return null
          return (
            <line key={i} x1={px(a.x)} y1={py(a.y)} x2={px(b.x)} y2={py(b.y)}
              stroke={laneColor[l.status] || laneColor.ok} strokeWidth={l.status === 'ok' ? 1.5 : 2.5}
              strokeDasharray={l.status === 'at-risk' ? '5 4' : undefined} opacity={l.status === 'ok' ? 0.5 : 0.9} />
          )
        })}
        {nodes.map(n => {
          const c = NODE_COLORS[n.type] || 'gray'
          return (
            <g key={n.id}>
              {n.impacted && <circle cx={px(n.x)} cy={py(n.y)} r={16} fill="none" stroke="var(--mantine-color-red-6)" strokeWidth={2.5} opacity={0.8} />}
              <circle cx={px(n.x)} cy={py(n.y)} r={11} fill={`var(--mantine-color-${c}-6)`} stroke="var(--mantine-color-body)" strokeWidth={2} />
              <text x={px(n.x)} y={py(n.y) + 26} textAnchor="middle" fontSize={10} fill="var(--mantine-color-dimmed)" fontWeight={600}>{n.label}</text>
            </g>
          )
        })}
      </svg>
      <Group gap="md" mt="xs" justify="center">
        {[['supplier', 'Supplier'], ['dc', 'DC'], ['store', 'Store']].map(([t, lbl]) => (
          <Group key={t} gap={4}><Box w={9} h={9} style={{ borderRadius: '50%', background: `var(--mantine-color-${NODE_COLORS[t]}-6)` }} /><Text size="10px" c="dimmed">{lbl}</Text></Group>
        ))}
        <Group gap={4}><Box w={12} h={0} style={{ borderTop: '2.5px dashed var(--mantine-color-orange-6)' }} /><Text size="10px" c="dimmed">At-risk lane</Text></Group>
        <Group gap={4}><Box w={12} h={0} style={{ borderTop: '2.5px solid var(--mantine-color-green-6)' }} /><Text size="10px" c="dimmed">Rerouted</Text></Group>
        <Group gap={4}><IconAlertTriangle size={11} color="var(--mantine-color-red-6)" /><Text size="10px" c="dimmed">Impacted node</Text></Group>
      </Group>
    </Box>
  )
}

// ── Before vs After flows — two network maps side by side ───────────────────
export function BeforeAfterFlow({ nodes, before, after, height = 190 }) {
  return (
    <SimpleGrid cols={2} spacing="md">
      <Paper withBorder p="sm" radius="md">
        <Badge size="xs" color="orange" variant="light" mb={4}>Before — current plan</Badge>
        <NetworkMap nodes={nodes} lanes={before} height={height} />
      </Paper>
      <Paper withBorder p="sm" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-green-5)' }}>
        <Badge size="xs" color="green" variant="light" mb={4}>After — recovery plan</Badge>
        <NetworkMap nodes={nodes} lanes={after} height={height} />
      </Paper>
    </SimpleGrid>
  )
}

// ── Efficient frontier — scatter of policy/plan options ─────────────────────
// points: [{ x, y, z, label, tone, recommended }]  (z drives bubble size)
export function EfficientFrontier({ points, xLabel, yLabel, zLabel, height = 260 }) {
  const toneVar = t => `var(--mantine-color-${t || 'gray'}-6)`
  return (
    <Box>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 10, right: 16, bottom: 24, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-3)" />
          <XAxis type="number" dataKey="x" name={xLabel} tick={{ fontSize: 10 }}
            label={{ value: xLabel, position: 'bottom', fontSize: 10, offset: 2 }} />
          <YAxis type="number" dataKey="y" name={yLabel} tick={{ fontSize: 10 }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 10 }} />
          <ZAxis type="number" dataKey="z" range={[80, 420]} name={zLabel} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: 11, borderRadius: 6 }}
            formatter={(v, n) => [v, n]} labelFormatter={() => ''}
            content={({ payload }) => {
              if (!payload || !payload.length) return null
              const p = payload[0].payload
              return (
                <Paper withBorder p="xs" radius="sm" style={{ fontSize: 11 }}>
                  <Text size="xs" fw={700}>{p.label}</Text>
                  <Text size="10px" c="dimmed">{xLabel}: {p.x}</Text>
                  <Text size="10px" c="dimmed">{yLabel}: {p.y}</Text>
                  <Text size="10px" c="dimmed">{zLabel}: {p.z}</Text>
                </Paper>
              )
            }} />
          <Scatter data={points}>
            {points.map((p, i) => (
              <Cell key={i} fill={toneVar(p.tone)} stroke={p.recommended ? 'var(--mantine-color-green-8)' : 'var(--mantine-color-body)'} strokeWidth={p.recommended ? 3 : 1} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <Group gap="md" justify="center" mt={4} wrap="wrap">
        {points.map((p, i) => (
          <Group key={i} gap={4}><Box w={9} h={9} style={{ borderRadius: '50%', background: toneVar(p.tone) }} /><Text size="10px" c="dimmed">{p.label}{p.recommended ? ' ★' : ''}</Text></Group>
        ))}
      </Group>
    </Box>
  )
}

// ── Inventory imbalance heatmap — echelon rows × SKU-family cols ─────────────
// rows: [labels], cols: [labels], cells: number[][] (percent vs policy; + excess, − shortage)
export function InventoryHeatmap({ rows, cols, cells }) {
  const colorFor = v => {
    if (v === 0) return 'var(--mantine-color-gray-1)'
    const a = Math.min(0.15 + (Math.abs(v) / 40) * 0.7, 0.9)
    return v > 0 ? `rgba(230,126,34,${a})` : `rgba(59,130,246,${a})`
  }
  return (
    <Box style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 10 }}>
        <thead>
          <tr>
            <th style={{ padding: 4 }}></th>
            {cols.map(c => <th key={c} style={{ padding: '4px 6px', color: 'var(--mantine-color-dimmed)', fontWeight: 600, textAlign: 'center' }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <td style={{ padding: '4px 8px', color: 'var(--mantine-color-dimmed)', fontWeight: 600, whiteSpace: 'nowrap' }}>{r}</td>
              {cols.map((c, ci) => {
                const v = cells[ri][ci]
                return (
                  <td key={ci} style={{ background: colorFor(v), textAlign: 'center', padding: '8px 6px', borderRadius: 3, fontWeight: 600, color: Math.abs(v) > 20 ? 'white' : 'var(--mantine-color-dark-5)' }}>
                    {v > 0 ? `+${v}%` : v < 0 ? `${v}%` : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Group gap="md" mt="xs" justify="center">
        <Group gap={4}><Box w={12} h={12} style={{ background: 'rgba(230,126,34,0.75)', borderRadius: 2 }} /><Text size="10px" c="dimmed">Excess vs policy</Text></Group>
        <Group gap={4}><Box w={12} h={12} style={{ background: 'rgba(59,130,246,0.75)', borderRadius: 2 }} /><Text size="10px" c="dimmed">Shortage vs policy</Text></Group>
      </Group>
    </Box>
  )
}

// ── Inventory-by-echelon location bars ──────────────────────────────────────
// data: [{ label, type:'supplier'|'dc'|'store', onHand, policy }]
export function InventoryLocation({ data }) {
  const max = Math.max(...data.map(d => Math.max(d.onHand, d.policy)))
  const Icon = { supplier: IconBuildingWarehouse, dc: IconBuildingWarehouse, store: IconBuildingStore }
  return (
    <Stack gap="xs">
      {data.map(d => {
        const NIcon = Icon[d.type] || IconBuildingWarehouse
        const over = d.onHand > d.policy
        return (
          <Group key={d.label} gap="sm" wrap="nowrap">
            <ThemeIcon size="sm" variant="light" color={NODE_COLORS[d.type]} radius="sm"><NIcon size={12} /></ThemeIcon>
            <Text size="xs" w={130} style={{ flexShrink: 0 }} lineClamp={1}>{d.label}</Text>
            <Box style={{ flex: 1, position: 'relative', height: 14 }}>
              <Box style={{ position: 'absolute', inset: 0, background: 'var(--mantine-color-gray-1)', borderRadius: 3 }} />
              <Box style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${(d.onHand / max) * 100}%`, background: over ? 'var(--mantine-color-orange-5)' : 'var(--mantine-color-teal-5)', borderRadius: 3 }} />
              <Box style={{ position: 'absolute', top: -2, bottom: -2, left: `${(d.policy / max) * 100}%`, width: 2, background: 'var(--mantine-color-dark-5)' }} title="policy target" />
            </Box>
            <Text size="10px" c={over ? 'orange' : 'teal'} fw={600} w={64} ta="right">{d.onHand.toLocaleString()}u</Text>
          </Group>
        )
      })}
      <Group gap="md" justify="flex-end">
        <Group gap={4}><Box w={10} h={10} style={{ background: 'var(--mantine-color-orange-5)', borderRadius: 2 }} /><Text size="10px" c="dimmed">Above policy</Text></Group>
        <Group gap={4}><Box w={2} h={10} style={{ background: 'var(--mantine-color-dark-5)' }} /><Text size="10px" c="dimmed">Policy target</Text></Group>
      </Group>
    </Stack>
  )
}

// ── Workflow actions — exact actions by WMS / OMS / TMS / APS ────────────────
const WF_META = {
  WMS: { color: 'violet', icon: IconBuildingWarehouse, name: 'WMS' },
  OMS: { color: 'orange', icon: IconBuildingStore, name: 'OMS' },
  TMS: { color: 'teal', icon: IconTruck, name: 'TMS' },
  APS: { color: 'blue', icon: IconBuildingWarehouse, name: 'APS' },
}
export function WorkflowActions({ actions }) {
  const order = ['WMS', 'OMS', 'TMS', 'APS']
  return (
    <SimpleGrid cols={2} spacing="sm">
      {order.filter(k => actions[k]?.length).map(k => {
        const m = WF_META[k]
        return (
          <Paper key={k} withBorder p="sm" radius="md" style={{ borderLeft: `3px solid var(--mantine-color-${m.color}-5)` }}>
            <Group gap="xs" mb={4}><ThemeIcon size="sm" color={m.color} variant="light" radius="sm"><m.icon size={12} /></ThemeIcon><Text fw={700} size="xs">{m.name}</Text><Badge size="xs" color={m.color} variant="light">{actions[k].length} actions</Badge></Group>
            <Stack gap={2}>
              {actions[k].map((a, i) => <Text key={i} size="10px" c="dimmed">• {a}</Text>)}
            </Stack>
          </Paper>
        )
      })}
    </SimpleGrid>
  )
}

// ── Strategy comparison — bars for a set of scored strategies ───────────────
// strategies: [{ name, tone, recommended, metrics: [{ label, value, pct }] }]
export function StrategyCompare({ strategies }) {
  return (
    <Stack gap="sm">
      {strategies.map(s => (
        <Paper key={s.name} withBorder p="sm" radius="md" style={{ borderLeft: `3px solid var(--mantine-color-${s.tone}-5)`, background: s.recommended ? `var(--mantine-color-${s.tone}-light)` : undefined }}>
          <Group justify="space-between" mb={6}><Text fw={700} size="xs">{s.name}</Text>{s.recommended && <Badge size="xs" color="green" variant="filled">recommended</Badge>}</Group>
          <SimpleGrid cols={3} spacing="xs">
            {s.metrics.map(m => (
              <Box key={m.label}>
                <Group justify="space-between"><Text size="10px" c="dimmed">{m.label}</Text><Text size="10px" fw={700}>{m.value}</Text></Group>
                <Progress value={m.pct} color={s.tone} size="xs" mt={2} />
              </Box>
            ))}
          </SimpleGrid>
        </Paper>
      ))}
    </Stack>
  )
}

// ── Learn — model/registry update cards ─────────────────────────────────────
// items: [{ label, before, after, delta, note }]
export function ModelUpdateGrid({ items, tone = 'grape' }) {
  return (
    <SimpleGrid cols={2} spacing="sm">
      {items.map(it => (
        <Paper key={it.label} withBorder p="sm" radius="md">
          <Text size="xs" fw={700} mb={2}>{it.label}</Text>
          <Group gap="xs" align="baseline">
            <Text size="sm" c="dimmed">{it.before}</Text>
            <Text size="xs" c="dimmed">→</Text>
            <Text size="sm" fw={800} c={tone}>{it.after}</Text>
            {it.delta && <Badge size="xs" color={tone} variant="light">{it.delta}</Badge>}
          </Group>
          {it.note && <Text size="10px" c="dimmed" mt={2}>{it.note}</Text>}
        </Paper>
      ))}
    </SimpleGrid>
  )
}
