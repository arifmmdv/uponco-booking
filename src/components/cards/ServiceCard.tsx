// ============================================================================
// Service Card Component
// ============================================================================

'use client';

import { Card, Text, Badge, Group, Stack, UnstyledButton } from '@mantine/core';
import { IconClock, IconCurrencyDollar, IconCheck } from '@tabler/icons-react';
import type { ParsedService } from '@/types/booking';

interface ServiceCardProps {
    service: ParsedService;
    selected?: boolean;
    onClick?: () => void;
}

function formatPrice(min: number, max: number): string {
    if (min === max) {
        return `$${min}`;
    }
    return `$${min} - $${max}`;
}

function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
}

export function ServiceCard({ service, selected = false, onClick }: ServiceCardProps) {
    return (
        <UnstyledButton onClick={onClick} style={{ width: '100%' }}>
            <Card
                withBorder
                padding="lg"
                radius="md"
                style={{
                    cursor: 'pointer',
                    borderColor: selected ? 'var(--mantine-color-green-6)' : undefined,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: selected ? 'var(--mantine-color-green-light)' : undefined,
                    transition: 'all 0.2s ease',
                }}
            >
                <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                        <Stack gap={4} style={{ flex: 1 }}>
                            <Text fw={600} size="md">{service.title}</Text>
                            {service.category && (
                                <Badge variant="light" size="xs" color="gray">
                                    {service.category.title}
                                </Badge>
                            )}
                        </Stack>
                        {selected && (
                            <IconCheck size={20} style={{ color: 'var(--mantine-color-green-6)' }} />
                        )}
                    </Group>

                    {service.description && (
                        <Text size="sm" c="dimmed" lineClamp={2}>
                            {service.description}
                        </Text>
                    )}

                    <Group gap="md">
                        <Group gap={4}>
                            <IconClock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                            <Text size="sm" c="dimmed">{formatDuration(service.duration)}</Text>
                        </Group>
                        <Group gap={4}>
                            <IconCurrencyDollar size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
                            <Text size="sm" c="dimmed">{formatPrice(service.priceMin, service.priceMax)}</Text>
                        </Group>
                    </Group>
                </Stack>
            </Card>
        </UnstyledButton>
    );
}
