import { useMemo } from 'react'
import {
  NavLink, Box, Divider, Text, Badge, Tooltip, ThemeIcon, Group, Stack,
  SegmentedControl, ActionIcon, ScrollArea
} from '@mantine/core'
import {
  IconRadar, IconPlayerPlay, IconShieldCheck, IconRoute2, IconRobot,
  IconCheck, IconChevronRight, IconLock, IconHandStop, IconBolt,
  IconTarget, IconChartBar, IconBook, IconSettings, IconTestPipe,
  IconRocket, IconRefresh, IconPlayerStop
} from '@tabler/icons-react'
import { Button, Paper } from '@mantine/core'
import { useUseCase } from '../../contexts/UseCaseContext'
import { BUCKET_COLORS, WORKFLOW_BUCKET_ORDER, STAGE_TO_BUCKET } from '../../theme'

// ── Nav spine — 5 visible buckets in static mode ─────────────────────────────
// Sense (home gallery + live signals) → Simulate → Trial → Execute → Learn
// Select appears only during workflow runs (not as a static nav destination).
const NAV_BUCKETS = [
  { id: 'sense',    label: 'Sense',    icon: IconRadar,       color: BUCKET_COLORS.sense    },
  { id: 'simulate', label: 'Simulate', icon: IconPlayerPlay,  color: BUCKET_COLORS.simulate },
  { id: 'select',   label: 'Select',   icon: IconTarget,      color: BUCKET_COLORS.select   },
  { id: 'trial',    label: 'Trial',    icon: IconTestPipe,    color: BUCKET_COLORS.trial    },
  { id: 'execute',  label: 'Execute',  icon: IconRocket,      color: BUCKET_COLORS.execute  },
  { id: 'learn',    label: 'Learn',    icon: IconRefresh,     color: BUCKET_COLORS.learn    },
]

// OPERATE is rendered separately at the bottom (not part of the workflow pipeline)
const OPERATE_BUCKET = { id: 'operate', label: 'Operate', icon: IconRobot, color: BUCKET_COLORS.operate }

// ── Mode Toggle (Guided / Autopilot) ──
function ModeToggle({ collapsed }) {
  const { autonomyMode, setAutonomyMode } = useUseCase()

  if (collapsed) {
    return (
      <Stack gap={4} align="center" mb="xs">
        <Tooltip label={`Guided mode${autonomyMode === 'guided' ? ' (active)' : ''}`} position="right" withArrow>
          <ActionIcon
            size={30} radius="xl"
            variant={autonomyMode === 'guided' ? 'filled' : 'subtle'}
            color={autonomyMode === 'guided' ? 'vanguardRed' : 'gray'}
            onClick={() => setAutonomyMode('guided')}
            style={autonomyMode === 'guided' ? { boxShadow: '0 0 12px rgba(150, 21, 29, 0.4)' } : {}}
          >
            <IconHandStop size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={`Autopilot mode${autonomyMode === 'autonomous' ? ' (active)' : ''}`} position="right" withArrow>
          <ActionIcon
            size={30} radius="xl"
            variant={autonomyMode === 'autonomous' ? 'filled' : 'subtle'}
            color={autonomyMode === 'autonomous' ? 'green' : 'gray'}
            onClick={() => setAutonomyMode('autonomous')}
            style={autonomyMode === 'autonomous' ? { boxShadow: '0 0 12px rgba(34, 197, 94, 0.5)' } : {}}
          >
            <IconBolt size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    )
  }

  return (
    <SegmentedControl
      size="sm"
      fullWidth
      radius="md"
      value={autonomyMode}
      onChange={setAutonomyMode}
      data={[
        { label: 'Guided', value: 'guided' },
        { label: 'Autopilot', value: 'autonomous' },
      ]}
      mb="sm"
      styles={{
        root: {
          border: '1px solid var(--mantine-color-default-border)',
          padding: 3,
        },
      }}
    />
  )
}

// ── Static Nav (no workflow active) ──
const STATIC_HIDDEN = new Set(['select', 'trial'])
function StaticNav({ activePage, onNavigate, collapsed }) {
  const allBuckets = [...NAV_BUCKETS.filter(b => !STATIC_HIDDEN.has(b.id)), OPERATE_BUCKET]
  const isOperate = (id) => id === 'operate'

  return (
    <>
      {allBuckets.map((bucket) => {
        const isActive = activePage === bucket.id
        const Icon = bucket.icon

        const content = (
          <NavLink
            label={collapsed ? null : bucket.label}
            leftSection={
              <ThemeIcon
                size={22} radius="xl"
                variant={isActive ? 'gradient' : 'subtle'}
                gradient={isActive ? { from: bucket.color, to: bucket.color, deg: 135 } : undefined}
                color={bucket.color}
                style={isActive ? { boxShadow: `0 0 6px var(--mantine-color-${bucket.color}-4)` } : {}}
              >
                <Icon size={14} stroke={1.5} />
              </ThemeIcon>
            }
            rightSection={isActive && !collapsed ? <IconChevronRight size={14} stroke={1.5} /> : null}
            active={isActive}
            color={bucket.color}
            radius="md"
            onClick={() => onNavigate(bucket.id)}
            style={isActive ? {
              background: `linear-gradient(90deg, var(--mantine-color-${bucket.color}-light), transparent)`,
              borderLeft: `3px solid var(--mantine-color-${bucket.color}-6)`,
            } : { borderLeft: '3px solid transparent' }}
          />
        )

        if (isOperate(bucket.id)) {
          return (
            <Box key={bucket.id} style={{ marginTop: 'auto' }}>
              <Divider my="xs" />
              {collapsed ? <Tooltip label={bucket.label} position="right" withArrow>{content}</Tooltip> : content}
            </Box>
          )
        }

        return (
          <Box key={bucket.id}>
            {collapsed ? <Tooltip label={bucket.label} position="right" withArrow>{content}</Tooltip> : content}
          </Box>
        )
      })}
    </>
  )
}

// ── Main Component ──
export default function WorkflowNav({ activePage, onNavigate, collapsed }) {
  const { activeUseCase } = useUseCase()

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <StaticNav activePage={activePage} onNavigate={onNavigate} collapsed={collapsed} />
    </Box>
  )
}
