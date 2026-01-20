// ============================================================================
// Accordion Header Component
// Premium styled header for booking accordion steps
// ============================================================================

'use client';

import { Group, Stack, Text, ThemeIcon, Box } from '@mantine/core';
import { IconCheck, IconMapPin, IconBriefcase, IconUser, IconCalendar, IconId } from '@tabler/icons-react';
import type { StepState } from '@/hooks/useBookingLogic';

interface AccordionHeaderProps {
    stepId: 'location' | 'service' | 'specialist' | 'datetime' | 'contact';
    title: string;
    subtitle: string;
    state: StepState;
    disabled?: boolean;
}

const stepIcons = {
    location: IconMapPin,
    service: IconBriefcase,
    specialist: IconUser,
    datetime: IconCalendar,
    contact: IconId,
};

const stepColors = {
    location: 'blue',
    service: 'teal',
    specialist: 'violet',
    datetime: 'orange',
    contact: 'pink',
};

export function AccordionHeader({
    stepId,
    title,
    subtitle,
    state,
    disabled = false,
}: AccordionHeaderProps) {
    const Icon = stepIcons[stepId];
    const color = stepColors[stepId];
    const isCompleted = state === 'completed';
    const isCurrent = state === 'current';

    return (
        <Group gap="md" wrap="nowrap" style={{ opacity: disabled ? 0.5 : 1 }}>
            {/* Step Icon */}
            <ThemeIcon
                size={40}
                radius="md"
                variant={isCompleted ? 'filled' : isCurrent ? 'light' : 'default'}
                color={isCompleted ? 'green' : color}
            >
                {isCompleted ? (
                    <IconCheck size={20} stroke={2.5} />
                ) : (
                    <Icon size={20} />
                )}
            </ThemeIcon>

            {/* Text Content */}
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text
                    size="sm"
                    fw={600}
                    c={disabled ? 'dimmed' : isCompleted ? 'dark' : isCurrent ? 'dark' : 'dimmed'}
                >
                    {title}
                </Text>
                <Text
                    size="xs"
                    c={isCompleted ? 'teal' : 'dimmed'}
                    lineClamp={1}
                    fw={isCompleted ? 500 : 400}
                >
                    {subtitle}
                </Text>
            </Stack>

            {/* Status Badge */}
            {isCompleted && (
                <Box
                    px="xs"
                    py={4}
                    style={{
                        borderRadius: 'var(--mantine-radius-sm)',
                        backgroundColor: 'var(--mantine-color-green-0)',
                    }}
                >
                    <Text size="xs" c="green" fw={500}>
                        Selected
                    </Text>
                </Box>
            )}
        </Group>
    );
}
