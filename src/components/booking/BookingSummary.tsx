// ============================================================================
// Booking Summary Component
// Displays locked/selected booking information
// ============================================================================

'use client';

import { Paper, Stack, Group, Text, Badge, ThemeIcon, Divider } from '@mantine/core';
import { IconMapPin, IconBriefcase, IconUser, IconLock, IconClock, IconCurrencyDollar } from '@tabler/icons-react';
import type { ParsedLocation, ParsedService, ParsedSpecialist } from '@/types/booking';

interface BookingSummaryProps {
    location: ParsedLocation | null;
    service: ParsedService | null;
    specialist: ParsedSpecialist | null;
    isLocked: {
        location: boolean;
        service: boolean;
        specialist: boolean;
    };
}

interface SummaryItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    isLocked: boolean;
    color: string;
}

function SummaryItem({ icon, label, value, subValue, isLocked, color }: SummaryItemProps) {
    return (
        <Group gap="sm" wrap="nowrap">
            <ThemeIcon
                size="lg"
                radius="md"
                variant="light"
                color={color}
            >
                {icon}
            </ThemeIcon>
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Group gap={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                        {label}
                    </Text>
                    {isLocked && (
                        <IconLock size={12} style={{ color: 'var(--mantine-color-gray-5)' }} />
                    )}
                </Group>
                <Text size="sm" fw={600} truncate>
                    {value}
                </Text>
                {subValue && (
                    <Text size="xs" c="dimmed" truncate>
                        {subValue}
                    </Text>
                )}
            </Stack>
        </Group>
    );
}

export function BookingSummary({
    location,
    service,
    specialist,
    isLocked,
}: BookingSummaryProps) {
    const hasAnySelection = location || service || specialist;

    if (!hasAnySelection) {
        return null;
    }

    const formatPrice = (min: number, max: number) => {
        if (min === max) return `$${min}`;
        return `$${min} - $${max}`;
    };

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            style={{
                background: 'var(--mantine-color-gray-0)',
                borderColor: 'var(--mantine-color-gray-2)',
            }}
        >
            <Stack gap="md">
                <Group justify="space-between">
                    <Text size="sm" fw={600} c="dimmed">
                        Booking Summary
                    </Text>
                    {(isLocked.location || isLocked.service || isLocked.specialist) && (
                        <Badge size="xs" variant="light" color="gray">
                            From link
                        </Badge>
                    )}
                </Group>

                <Stack gap="sm">
                    {location && (
                        <SummaryItem
                            icon={<IconMapPin size={16} />}
                            label="Location"
                            value={location.name}
                            subValue={location.locationType === 'online' ? 'Virtual Meeting' : location.address}
                            isLocked={isLocked.location}
                            color="blue"
                        />
                    )}

                    {service && (
                        <>
                            {location && <Divider />}
                            <SummaryItem
                                icon={<IconBriefcase size={16} />}
                                label="Service"
                                value={service.title}
                                isLocked={isLocked.service}
                                color="teal"
                            />
                            <Group gap="lg" pl={44}>
                                <Group gap={4}>
                                    <IconClock size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <Text size="xs" c="dimmed">{service.duration} min</Text>
                                </Group>
                                <Group gap={4}>
                                    <IconCurrencyDollar size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <Text size="xs" c="dimmed">{formatPrice(service.priceMin, service.priceMax)}</Text>
                                </Group>
                            </Group>
                        </>
                    )}

                    {specialist && (
                        <>
                            {(location || service) && <Divider />}
                            <SummaryItem
                                icon={<IconUser size={16} />}
                                label="Specialist"
                                value={specialist.fullName}
                                isLocked={isLocked.specialist}
                                color="violet"
                            />
                        </>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
