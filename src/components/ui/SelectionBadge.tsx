// ============================================================================
// Selection Badge Component
// Shows current selections as badges for user feedback
// ============================================================================

'use client';

import { Badge, Group, Text, Paper, Stack, ActionIcon } from '@mantine/core';
import { IconX, IconMapPin, IconBriefcase, IconUser, IconCalendar, IconClock } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { ParsedLocation, ParsedService, ParsedSpecialist } from '@/types/booking';

interface SelectionBadgeProps {
    location?: ParsedLocation | null;
    service?: ParsedService | null;
    specialist?: ParsedSpecialist | null;
    date?: Date | null;
    time?: string | null;
    onClearLocation?: () => void;
    onClearService?: () => void;
    onClearSpecialist?: () => void;
    compact?: boolean;
}

export function SelectionBadge({
    location,
    service,
    specialist,
    date,
    time,
    onClearLocation,
    onClearService,
    onClearSpecialist,
    compact = false,
}: SelectionBadgeProps) {
    const hasSelections = location || service || specialist || date || time;

    if (!hasSelections) {
        return null;
    }

    if (compact) {
        return (
            <Group gap="xs" wrap="wrap">
                {location && (
                    <Badge
                        variant="light"
                        leftSection={<IconMapPin size={12} />}
                        rightSection={
                            onClearLocation && (
                                <ActionIcon size="xs" variant="transparent" onClick={onClearLocation}>
                                    <IconX size={10} />
                                </ActionIcon>
                            )
                        }
                    >
                        {location.name}
                    </Badge>
                )}
                {service && (
                    <Badge
                        variant="light"
                        color="green"
                        leftSection={<IconBriefcase size={12} />}
                        rightSection={
                            onClearService && (
                                <ActionIcon size="xs" variant="transparent" onClick={onClearService}>
                                    <IconX size={10} />
                                </ActionIcon>
                            )
                        }
                    >
                        {service.title}
                    </Badge>
                )}
                {specialist && (
                    <Badge
                        variant="light"
                        color="violet"
                        leftSection={<IconUser size={12} />}
                        rightSection={
                            onClearSpecialist && (
                                <ActionIcon size="xs" variant="transparent" onClick={onClearSpecialist}>
                                    <IconX size={10} />
                                </ActionIcon>
                            )
                        }
                    >
                        {specialist.fullName}
                    </Badge>
                )}
                {date && (
                    <Badge variant="light" color="orange" leftSection={<IconCalendar size={12} />}>
                        {dayjs(date).format('MMM D')}
                    </Badge>
                )}
                {time && (
                    <Badge variant="light" color="cyan" leftSection={<IconClock size={12} />}>
                        {time}
                    </Badge>
                )}
            </Group>
        );
    }

    return (
        <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
                <Text size="sm" fw={500} c="dimmed">Your selections</Text>
                <Group gap="xs" wrap="wrap">
                    {location && (
                        <Badge
                            size="lg"
                            variant="light"
                            leftSection={<IconMapPin size={14} />}
                        >
                            {location.name}
                        </Badge>
                    )}
                    {service && (
                        <Badge
                            size="lg"
                            variant="light"
                            color="green"
                            leftSection={<IconBriefcase size={14} />}
                        >
                            {service.title}
                        </Badge>
                    )}
                    {specialist && (
                        <Badge
                            size="lg"
                            variant="light"
                            color="violet"
                            leftSection={<IconUser size={14} />}
                        >
                            {specialist.fullName}
                        </Badge>
                    )}
                    {date && (
                        <Badge
                            size="lg"
                            variant="light"
                            color="orange"
                            leftSection={<IconCalendar size={14} />}
                        >
                            {dayjs(date).format('ddd, MMM D')}
                        </Badge>
                    )}
                    {time && (
                        <Badge
                            size="lg"
                            variant="light"
                            color="cyan"
                            leftSection={<IconClock size={14} />}
                        >
                            {time}
                        </Badge>
                    )}
                </Group>
            </Stack>
        </Paper>
    );
}
