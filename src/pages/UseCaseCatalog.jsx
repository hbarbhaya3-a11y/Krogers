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
import { useUseCase } from '../contexts/UseCaseContext'

// ── Step icon map ─────────────────────────────────────────────────────────
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

// ── Severity badge ──────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────
export default function UseCaseCatalog({ onRunScenario }) {
  const { launch } = useUseCase()

  const handleRun = (uc) => {
    if (onRunScenario) onRunScenario(uc)
    else launch(uc)
  }

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
                Vanguard Personal Wealth Scenarios
              </Text>
            </Group>
            <Text size="xs" c="dimmed" maw={580}>
              Behavioral-finance-informed guidance · education-first outreach · ERISA-aligned fiduciary posture
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
      
      <Text c="dimmed">Scenario gallery coming soon. Navigate to other tabs to explore the platform.</Text>
    </Stack>
  )
}
