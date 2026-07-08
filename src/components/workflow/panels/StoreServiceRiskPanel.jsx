import { useState, useEffect } from 'react'
import {
  Paper, Stack, Group, Text, Badge, SimpleGrid, Progress, Divider, Button,
  ThemeIcon, Select, MultiSelect, Switch, Table, Alert, Loader, Box, List,
  Modal, ScrollArea,
} from '@mantine/core'
import {
  IconRadar, IconTargetArrow, IconAdjustments, IconChartBar, IconTrophy,
  IconShieldCheck, IconDeviceFloppy, IconCheck, IconChevronRight, IconRefresh,
  IconAlertTriangle, IconBolt, IconArrowRight, IconFileExport, IconRoute,
  IconDownload, IconX, IconFileText,
} from '@tabler/icons-react'
import { useUseCase } from '../../../contexts/UseCaseContext'
import * as D from '../../../data/storeServiceRisk'

// ── Loading transition — supply-chain context per screen ────────────────────
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
    <Button size="md" variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 135 }}
      rightSection={icon || <IconChevronRight size={16} stroke={2} />} onClick={onClick} style={{ alignSelf: 'flex-end' }}>
      {label}
    </Button>
  )
}

// ── Strategy plan — build downloadable text + modal ─────────────────────────
function planToText(r) {
  const p = r.plan
  const L = [`# ${p.title}`, '', `Recommendation: ${r.cardTitle}`, '', `Objective`, p.objective, '', `Phased actions`]
  p.phases.forEach(ph => { L.push('', ph.name); ph.actions.forEach(a => L.push(`  - ${a}`)) })
  L.push('', 'Changes')
  p.changes.forEach(c => L.push(`  - ${c.area}: ${c.change}`))
  L.push('', 'Guardrails')
  p.guardrails.forEach(g => L.push(`  - ${g}`))
  L.push('', 'Expected impact', p.expected)
  return L.join('\n')
}

function downloadPlan(r) {
  const blob = new Blob([planToText(r)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = r.plan.title.replace(/[^\w]+/g, '_').replace(/^_+|_+$/g, '') + '.md'
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

function StrategyModal({ reco, onClose }) {
  const p = reco?.plan
  return (
    <Modal
      opened={!!reco} onClose={onClose} size="lg" radius="md" withCloseButton={false}
      title={
        <Group justify="space-between" wrap="nowrap" w="100%">
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon size="sm" variant="light" color={reco?.tone || 'orange'} radius="sm"><IconFileText size={14} /></ThemeIcon>
            <Text fw={700} size="sm">{p?.title}</Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <Button size="xs" color={reco?.tone || 'orange'} leftSection={<IconDownload size={14} />} onClick={() => downloadPlan(reco)}>Download</Button>
            <Button size="xs" variant="light" color="gray" leftSection={<IconX size={14} />} onClick={onClose}>Close</Button>
          </Group>
        </Group>
      }
      styles={{ title: { width: '100%' }, header: { alignItems: 'flex-start' } }}
    >
      {p && (
        <ScrollArea.Autosize mah="65vh">
          <Stack gap="md" pr="sm">
            <Box><Text fw={700} size="xs" c="dimmed" tt="uppercase" mb={2}>Objective</Text><Text size="sm">{p.objective}</Text></Box>
            <Box>
              <Text fw={700} size="xs" c="dimmed" tt="uppercase" mb={4}>Phased actions</Text>
              <Stack gap="xs">
                {p.phases.map(ph => (
                  <Paper key={ph.name} withBorder p="sm" radius="md" style={{ borderLeft: `3px solid var(--mantine-color-${reco.tone}-5)` }}>
                    <Text size="xs" fw={700} mb={4}>{ph.name}</Text>
                    <List size="xs" spacing={2}>{ph.actions.map((a, i) => <List.Item key={i}>{a}</List.Item>)}</List>
                  </Paper>
                ))}
              </Stack>
            </Box>
            <Box>
              <Text fw={700} size="xs" c="dimmed" tt="uppercase" mb={4}>What changes</Text>
              <Table fz="xs" withTableBorder withColumnBorders>
                <Table.Thead><Table.Tr><Table.Th>Area</Table.Th><Table.Th>Change</Table.Th></Table.Tr></Table.Thead>
                <Table.Tbody>{p.changes.map(c => <Table.Tr key={c.area}><Table.Td fw={600}>{c.area}</Table.Td><Table.Td>{c.change}</Table.Td></Table.Tr>)}</Table.Tbody>
              </Table>
            </Box>
            <Box>
              <Text fw={700} size="xs" c="dimmed" tt="uppercase" mb={4}>Guardrails</Text>
              <Group gap={6} wrap="wrap">{p.guardrails.map(g => <Badge key={g} size="xs" variant="light" color={reco.tone}>{g}</Badge>)}</Group>
            </Box>
            <Alert color={reco.tone} variant="light" p="xs"><Text size="xs"><b>Expected impact:</b> {p.expected}</Text></Alert>
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Modal>
  )
}

function SectionHead({ icon: Icon, title, color = 'orange' }) {
  return (
    <Group gap="xs">
      <ThemeIcon size="sm" variant="light" color={color} radius="sm"><Icon size={13} stroke={1.6} /></ThemeIcon>
      <Text fw={700} size="sm">{title}</Text>
    </Group>
  )
}

// ══════════════════ Screen 1 — Signal Analysis ══════════════════════════════
function Screen1({ onContinue }) {
  const s = D.SSR_SIGNAL
  return (
    <Stack gap="md">
      <Alert color="orange" variant="light" icon={<IconAlertTriangle size={16} />} title={s.sentinel}>
        <Text size="sm">{s.bannerText}</Text>
      </Alert>
      <SimpleGrid cols={2} spacing="md">
        <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-orange-5)' }}>
          <SectionHead icon={IconRadar} title="Signal summary" />
          <Table fz="xs" mt="xs">
            <Table.Tbody>
              {s.card.map(r => (
                <Table.Tr key={r.label}>
                  <Table.Td c="dimmed" w="45%">{r.label}</Table.Td>
                  <Table.Td fw={r.label === 'Severity' ? 700 : 500}>
                    {r.label === 'Severity' ? <Badge color="orange" size="sm" variant="filled">{r.value}</Badge> : r.value}
                    {r.note && <Text span size="10px" c="dimmed"> {r.note}</Text>}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group gap={6} mt="sm" wrap="wrap">
            {s.sourceChips.map(c => <Badge key={c} size="xs" variant="outline" color="gray" style={{ fontFamily: 'monospace' }}>{c}</Badge>)}
          </Group>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <SectionHead icon={IconBolt} title="Signal detail" />
          <Text size="xs" c="dimmed" mt="xs" mb="xs">{s.detail}</Text>
          <Text size="xs" fw={600} mb={4}>Triggered by three converging conditions:</Text>
          <List size="xs" type="ordered" spacing={4}>{s.conditions.map((c, i) => <List.Item key={i}>{c}</List.Item>)}</List>
          <Text size="10px" c="dimmed" mt="xs">{s.conditionsNote}</Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md" style={{ borderLeft: '3px solid var(--mantine-color-indigo-5)', background: 'var(--mantine-color-indigo-light)' }}>
        <Group gap="xs" mb={4}><ThemeIcon size={22} radius="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 135 }}><IconTargetArrow size={13} color="white" /></ThemeIcon><Text fw={700} size="sm">Recommended Hypothesis</Text></Group>
        <Text size="sm" style={{ lineHeight: 1.7 }}>{D.SSR_HYPOTHESIS}</Text>
      </Paper>
      <ContinueButton onClick={onContinue} label="Continue to Objectives" />
    </Stack>
  )
}

// ══════════════════ Screen 2 — Objectives & KPIs ════════════════════════════
function Screen2({ ws, setWs, onContinue }) {
  const primary = ws.ssrPrimary ?? D.SSR_PRIMARY_DEFAULT
  const secondary = ws.ssrSecondary ?? D.SSR_SECONDARY_DEFAULT
  const kpis = ws.ssrKpis ?? D.SSR_KPI_DEFAULT
  return (
    <Stack gap="md">
      <Alert color="blue" variant="light" icon={<IconTargetArrow size={16} />}>
        <Text size="sm">Define scenario objective, constraints, and success KPIs — TwinX will align the simulation pipeline to this objective.</Text>
      </Alert>
      <Paper withBorder p="md" radius="md">
        <SectionHead icon={IconTargetArrow} title="Primary objective" />
        <Select mt="xs" data={D.SSR_PRIMARY_OBJECTIVES.map(o => o.value)} value={primary}
          onChange={v => setWs(s => ({ ...s, ssrPrimary: v }))} allowDeselect={false}
          description={D.SSR_PRIMARY_OBJECTIVES.find(o => o.value === primary)?.desc} />
      </Paper>
      <Paper withBorder p="md" radius="md">
        <SectionHead icon={IconTargetArrow} title="Secondary objective" color="violet" />
        <MultiSelect mt="xs" data={D.SSR_SECONDARY_OBJECTIVES.map(o => o.value)} value={secondary}
          onChange={v => setWs(s => ({ ...s, ssrSecondary: v }))} clearable searchable />
      </Paper>
      <Paper withBorder p="md" radius="md">
        <SectionHead icon={IconChartBar} title="Success KPIs" color="teal" />
        <MultiSelect mt="xs" data={D.SSR_KPI_OPTIONS.map(k => k.value)} value={kpis}
          onChange={v => setWs(s => ({ ...s, ssrKpis: v }))} clearable searchable />
        <Group gap={6} mt="sm" wrap="wrap">{kpis.map(k => <Badge key={k} size="xs" color="teal" variant="light">{k}</Badge>)}</Group>
      </Paper>
      <Paper withBorder p="md" radius="md" style={{ background: 'var(--mantine-color-default-hover)' }}>
        <Text size="xs" fw={700} mb={4}>Scenario summary</Text>
        <Text size="xs" c="dimmed">Protect store service across at-risk replenishment orders while minimizing premium freight and using available network inventory before expediting.</Text>
        <Text size="xs" mt="xs"><b>Primary:</b> {primary}</Text>
        <Text size="xs"><b>Secondary:</b> {secondary.join(' + ') || '—'}</Text>
        <Text size="xs"><b>KPIs:</b> {kpis.join(', ') || '—'}</Text>
      </Paper>
      <ContinueButton onClick={onContinue} label="Continue to Levers" icon={<IconAdjustments size={16} />} />
    </Stack>
  )
}

// ══════════════════ Screen 3 — Simulation Levers ════════════════════════════
function Screen3({ ws, setWs, onContinue }) {
  const levers = ws.ssrLevers ?? D.SSR_LEVER_DEFAULTS
  const setLever = (id, v) => setWs(s => ({ ...s, ssrLevers: { ...(s.ssrLevers ?? D.SSR_LEVER_DEFAULTS), [id]: v } }))
  const reset = () => setWs(s => ({ ...s, ssrLevers: { ...D.SSR_LEVER_DEFAULTS } }))
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <SectionHead icon={IconAdjustments} title="Simulation levers" />
        <Button size="xs" variant="light" color="gray" leftSection={<IconRefresh size={12} />} onClick={reset}>Reset to recommended</Button>
      </Group>
      <Alert color="green" variant="light" p="xs"><Text size="xs">All levers are pre-set to their <b>recommended</b> values. Adjust any lever to explore alternatives, then run the scenario.</Text></Alert>
      {D.SSR_LEVER_GROUPS.map(g => (
        <Paper key={g.group} withBorder p="md" radius="md" style={{ borderLeft: `3px solid var(--mantine-color-${g.color}-5)` }}>
          <Text fw={700} size="xs" tt="uppercase" c={g.color} mb="xs" style={{ letterSpacing: '0.05em' }}>Group {g.group} — {g.title}</Text>
          <Stack gap="sm">
            {g.levers.map(l => {
              const val = levers[l.id]
              const isRec = val === l.recommended
              return (
                <Box key={l.id}>
                  <Group justify="space-between" mb={2} wrap="nowrap">
                    <Text size="xs" fw={600}>{l.label}</Text>
                    <Badge size="xs" color={isRec ? 'green' : 'orange'} variant="light">{isRec ? 'recommended' : 'custom'}</Badge>
                  </Group>
                  {l.control === 'switch' ? (
                    <Switch size="xs" color={g.color} checked={!!val} onChange={e => setLever(l.id, e.currentTarget.checked)}
                      label={val ? (l.onLabel || 'On') : 'Off'} />
                  ) : (
                    <Select size="xs" data={l.options} value={val} onChange={v => setLever(l.id, v)} allowDeselect={false} />
                  )}
                </Box>
              )
            })}
          </Stack>
        </Paper>
      ))}
      <ContinueButton onClick={onContinue} label="Review Scenario Setup" icon={<IconChartBar size={16} />} />
    </Stack>
  )
}

// ══════════════════ Screen 4 — Simulation Summary ═══════════════════════════
function Screen4({ onContinue }) {
  const sc = D.SSR_SCENARIO
  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-violet-5)' }}>
        <SectionHead icon={IconChartBar} title="Scenario" color="violet" />
        <SimpleGrid cols={2} spacing="xs" mt="xs">
          <Text size="xs"><b>Scenario:</b> {sc.name}</Text>
          <Text size="xs"><b>Signal:</b> {sc.signal}</Text>
          <Text size="xs"><b>Objective:</b> {sc.objective}</Text>
          <Text size="xs"><b>Method:</b> {sc.method}</Text>
        </SimpleGrid>
      </Paper>
      <SimpleGrid cols={2} spacing="md">
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="xs" mb="xs">Simulation scope</Text>
          <Table fz="xs"><Table.Tbody>
            {D.SSR_SCOPE.map(r => (
              <Table.Tr key={r.item}><Table.Td c="dimmed" w="45%">{r.item}</Table.Td>
                <Table.Td>{r.value}{r.note && <Text span size="10px" c="dimmed"> {r.note}</Text>}</Table.Td></Table.Tr>
            ))}
          </Table.Tbody></Table>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="xs" mb="xs">Pre-run validation checks</Text>
          <Stack gap={6}>
            {D.SSR_VALIDATION.map(v => (
              <Group key={v} gap="xs" wrap="nowrap"><ThemeIcon size="xs" color="green" variant="light" radius="xl"><IconCheck size={10} /></ThemeIcon><Text size="xs">{v}</Text></Group>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>
      <ContinueButton onClick={onContinue} label="Run Simulation" icon={<IconTrophy size={16} />} />
    </Stack>
  )
}

// ══════════════════ Screen 5 — Simulation Results ═══════════════════════════
function RecoCard({ r, selected, onSelect, onViewPlan }) {
  return (
    <Paper withBorder p="md" radius="md" onClick={onSelect}
      style={{ cursor: 'pointer', borderColor: selected ? `var(--mantine-color-${r.tone}-6)` : undefined, background: selected ? `var(--mantine-color-${r.tone}-light)` : undefined, borderLeft: `3px solid var(--mantine-color-${r.tone}-5)` }}>
      <Group justify="space-between" mb={4}>
        <Text fw={700} size="sm">{r.cardTitle}</Text>
        {r.recommended && <Badge size="xs" color="green" variant="filled">recommended</Badge>}
      </Group>
      <List size="xs" spacing={2} mb="xs">{r.recommends.map((x, i) => <List.Item key={i}>{x}</List.Item>)}</List>
      <Table fz="xs" withTableBorder>
        <Table.Thead><Table.Tr><Table.Th>KPI</Table.Th><Table.Th>Baseline</Table.Th><Table.Th>After</Table.Th><Table.Th>Impact</Table.Th></Table.Tr></Table.Thead>
        <Table.Tbody>{r.kpi.map(k => (
          <Table.Tr key={k.k}><Table.Td>{k.k}</Table.Td><Table.Td c="dimmed">{k.b}</Table.Td><Table.Td fw={700}>{k.a}</Table.Td>
            <Table.Td c={k.d.startsWith('-') && !k.k.toLowerCase().includes('stockout') && !k.k.toLowerCase().includes('freight') && !k.k.toLowerCase().includes('ttr') ? 'red' : 'green'} fw={600}>{k.d}</Table.Td></Table.Tr>
        ))}</Table.Tbody>
      </Table>
      <SimpleGrid cols={2} spacing={4} mt="xs">
        <Text size="10px" c="dimmed"><b>Trigger:</b> {r.trigger}</Text>
        <Text size="10px" c="dimmed"><b>Confidence:</b> {r.confidence}</Text>
        <Text size="10px" c="dimmed"><b>Levers used:</b> {r.leversUsed}</Text>
        <Text size="10px" c="dimmed"><b>Impacted scope:</b> {r.impacted}</Text>
      </SimpleGrid>
      <Text size="10px" c="dimmed" mt="xs">{r.why}</Text>
      <Text size="10px" mt={4}><b>Best used when:</b> {r.bestWhen}</Text>
      <Text size="10px" c="orange" mt={2}><b>Risk:</b> {r.risk}</Text>
      <Text size="10px" c="dimmed" mt={2}><b>Why not alternatives:</b> {r.whyNot}</Text>
      <Group justify="space-between" align="center" mt="sm">
        {selected
          ? <Badge size="xs" color={r.tone} variant="light" leftSection={<IconCheck size={10} />}>Selected</Badge>
          : <span />}
        <Button size="xs" variant="light" color={r.tone} leftSection={<IconFileText size={13} />}
          onClick={(e) => { e.stopPropagation(); onViewPlan(r) }}>
          View strategy details
        </Button>
      </Group>
    </Paper>
  )
}
function Screen5({ ws, setWs, onContinue }) {
  const selId = ws.ssrRecoId ?? 'combined'
  const [planReco, setPlanReco] = useState(null)
  return (
    <Stack gap="md">
      <StrategyModal reco={planReco} onClose={() => setPlanReco(null)} />
      <Alert color="gray" variant="light" p="xs"><Text size="10px">Demo-ready illustrative values calibrated to the source-defined KPIs and levers; the source documents provide KPI categories and value levers but not this signal's exact run output.</Text></Alert>
      <Paper withBorder p="md" radius="md">
        <Text fw={700} size="xs" mb="xs">Baseline snapshot — current plan</Text>
        <SimpleGrid cols={4} spacing="xs">
          {D.SSR_BASELINE.map(b => (
            <Box key={b.kpi}><Text fw={800} size="md" c="orange">{b.value}</Text><Text size="10px" c="dimmed" lineClamp={2}>{b.kpi}</Text></Box>
          ))}
        </SimpleGrid>
      </Paper>
      <SectionHead icon={IconTrophy} title="Optimization recommendations" />
      {D.SSR_RECOMMENDATIONS.map(r => (
        <RecoCard key={r.id} r={r} selected={r.id === selId} onSelect={() => setWs(s => ({ ...s, ssrRecoId: r.id }))} onViewPlan={setPlanReco} />
      ))}
      <Paper withBorder p="md" radius="md">
        <Text fw={700} size="xs" mb="xs">Recommendation ranking</Text>
        <Table fz="xs" withTableBorder withColumnBorders striped>
          <Table.Thead><Table.Tr><Table.Th>Rank</Table.Th><Table.Th>Recommendation</Table.Th><Table.Th>Service</Table.Th><Table.Th>Cost</Table.Th><Table.Th>Speed</Table.Th><Table.Th>Feasibility</Table.Th><Table.Th>Select</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>{D.SSR_RANKING.map(r => (
            <Table.Tr key={r.rank}><Table.Td fw={700}>{r.rank}</Table.Td><Table.Td>{r.reco}</Table.Td><Table.Td>{r.service}</Table.Td><Table.Td>{r.cost}</Table.Td><Table.Td>{r.speed}</Table.Td><Table.Td>{r.feasibility}</Table.Td>
              <Table.Td><Badge size="xs" color={r.select === 'Selected' ? 'green' : 'gray'} variant={r.select === 'Selected' ? 'filled' : 'outline'}>{r.select}</Badge></Table.Td></Table.Tr>
          ))}</Table.Tbody>
        </Table>
      </Paper>
      <ContinueButton onClick={onContinue} label="Continue to Approval" icon={<IconShieldCheck size={16} />} />
    </Stack>
  )
}

// ══════════════════ Screen 6 — Approval & Execution ═════════════════════════
function Screen6({ onApprove }) {
  const { goToStep } = useUseCase()
  const a = D.SSR_APPROVAL
  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-yellow-6)' }}>
        <Group gap="xs" mb="xs"><Badge color="yellow" variant="filled" size="sm">EXECUTE</Badge><Text fw={700} size="sm">Approval & Execution</Text></Group>
        <Text size="sm"><b>Selected:</b> {a.selected}</Text>
        <Text size="xs" c="dimmed">Recovery action: {a.action}</Text>
      </Paper>
      <SimpleGrid cols={2} spacing="md">
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="xs" mb="xs">Approval summary</Text>
          <Table fz="xs"><Table.Tbody>{a.summary.map(r => <Table.Tr key={r.field}><Table.Td c="dimmed" w="42%">{r.field}</Table.Td><Table.Td>{r.value}</Table.Td></Table.Tr>)}</Table.Tbody></Table>
        </Paper>
        <Paper withBorder p="md" radius="md">
          <Text fw={700} size="xs" mb="xs">Constraints honored</Text>
          <Stack gap={6}>{a.constraints.map(c => <Group key={c} gap="xs" wrap="nowrap"><ThemeIcon size="xs" color="green" variant="light" radius="xl"><IconCheck size={10} /></ThemeIcon><Text size="xs">{c}</Text></Group>)}</Stack>
        </Paper>
      </SimpleGrid>
      <Paper withBorder p="md" radius="md">
        <Text fw={700} size="xs" mb="xs">What will be sent for execution</Text>
        <Table fz="xs" withTableBorder withColumnBorders>
          <Table.Thead><Table.Tr><Table.Th>Item</Table.Th><Table.Th>Target workflow</Table.Th><Table.Th>Action</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>{a.execItems.map(it => <Table.Tr key={it.item}><Table.Td fw={600}>{it.item}</Table.Td><Table.Td c="dimmed">{it.target}</Table.Td><Table.Td>{it.action}</Table.Td></Table.Tr>)}</Table.Tbody>
        </Table>
      </Paper>
      <Paper withBorder p="md" radius="md" style={{ background: 'var(--mantine-color-green-light)' }}>
        <Text size="xs" fw={700} mb={2}>Why this is recommended</Text>
        <Text size="xs" c="dimmed">{a.rationale}</Text>
      </Paper>
      <Group justify="flex-end" gap="sm" wrap="wrap">
        <Button size="xs" variant="subtle" color="gray" onClick={() => goToStep(2)}>Modify Levers</Button>
        <Button size="xs" variant="light" color="gray">Reject Recommendation</Button>
        <Button size="xs" variant="light" color="grape" leftSection={<IconDeviceFloppy size={14} />}>Save as Draft</Button>
        <Button size="md" color="green" leftSection={<IconShieldCheck size={16} />} onClick={() => onApprove?.('Approved — Combined Service Protection Recovery')}>Approve &amp; Send to Execution</Button>
      </Group>
    </Stack>
  )
}

// ══════════════════ Screen 7 — Learn & Save ═════════════════════════════════
function Screen7({ ws, setWs, onExit }) {
  const { exit } = useUseCase()
  const goHome = onExit || exit
  const saved = ws.ssrSaved
  const sv = D.SSR_SAVE
  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md" style={{ borderLeft: '3px solid var(--mantine-color-grape-6)' }}>
        <Group gap="xs" mb="xs"><Badge color="grape" variant="filled" size="sm">LEARN</Badge><Text fw={700} size="sm">Learn & Save Scenario</Text></Group>
        <Text size="xs" c="dimmed">Compare predicted vs actual KPI movement, update model learning, and save the scenario to the library.</Text>
      </Paper>
      <Paper withBorder p="md" radius="md">
        <Text fw={700} size="xs" mb="xs">Execution outcome summary</Text>
        <Table fz="xs" withTableBorder withColumnBorders striped>
          <Table.Thead><Table.Tr><Table.Th>Metric</Table.Th><Table.Th>Predicted</Table.Th><Table.Th>Actual</Table.Th><Table.Th>Learning outcome</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>{D.SSR_OUTCOMES.map(o => (
            <Table.Tr key={o.metric}><Table.Td fw={600}>{o.metric}</Table.Td><Table.Td c="dimmed">{o.pred}</Table.Td><Table.Td fw={700}>{o.actual}</Table.Td><Table.Td c="dimmed">{o.learn}</Table.Td></Table.Tr>
          ))}</Table.Tbody>
        </Table>
      </Paper>
      <Paper withBorder p="md" radius="md">
        <Text fw={700} size="xs" mb="xs">TwinX learned</Text>
        <List size="xs" type="ordered" spacing={2}>{D.SSR_INSIGHTS.map((x, i) => <List.Item key={i}>{x}</List.Item>)}</List>
      </Paper>
      <Paper withBorder p="md" radius="md" style={{ background: 'var(--mantine-color-default-hover)' }}>
        <Text fw={700} size="xs">Save scenario to library</Text>
        <Text size="xs" mt={4}><b>Name:</b> {sv.name}</Text>
        <Group gap={6} mt="xs" wrap="wrap">{sv.tags.map(t => <Badge key={t} size="xs" color="grape" variant="light">{t}</Badge>)}</Group>
        <Text size="xs" fw={600} mt="sm">Reusable for:</Text>
        <List size="xs" spacing={1}>{sv.reusableFor.map((r, i) => <List.Item key={i}>{r}</List.Item>)}</List>
      </Paper>
      <Group justify="flex-end" gap="sm" wrap="wrap">
        <Button size="xs" variant="light" color="grape" leftSection={<IconDeviceFloppy size={14} />} disabled={saved}
          onClick={() => setWs(s => ({ ...s, ssrSaved: true }))}>{saved ? 'Saved to library' : 'Save to Scenario Library'}</Button>
        <Button size="xs" variant="subtle" color="gray" leftSection={<IconFileExport size={14} />}>Export Decision Log</Button>
        <Button size="xs" variant="light" color="orange" leftSection={<IconRoute size={14} />} onClick={goHome}>Open Next At-Risk Signal</Button>
        <Button size="md" color="green" leftSection={<IconCheck size={16} />} onClick={goHome}>Exit Guided Flow</Button>
      </Group>
    </Stack>
  )
}

// ══════════════════ Dispatcher ══════════════════════════════════════════════
export default function StoreServiceRiskPanel({ step, workflowState, setWorkflowState, onContinue, onApprove, onExit }) {
  const screen = step.panelData?.screen ?? 1
  const lines = D.SSR_LOADING_LINES[screen] || ['Loading…']
  const { phase, idx } = useLoadingPhase(lines)
  if (phase === 'loading') return <LoadingScreen lines={lines} idx={idx} />

  const ws = workflowState, setWs = setWorkflowState
  switch (screen) {
    case 1: return <Screen1 onContinue={onContinue} />
    case 2: return <Screen2 ws={ws} setWs={setWs} onContinue={onContinue} />
    case 3: return <Screen3 ws={ws} setWs={setWs} onContinue={onContinue} />
    case 4: return <Screen4 onContinue={onContinue} />
    case 5: return <Screen5 ws={ws} setWs={setWs} onContinue={onContinue} />
    case 6: return <Screen6 onApprove={onApprove} />
    default: return <Screen7 ws={ws} setWs={setWs} onExit={onExit} />
  }
}
