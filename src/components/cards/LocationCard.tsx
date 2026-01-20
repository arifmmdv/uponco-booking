// ============================================================================
// Location Card Component
// ============================================================================

'use client';

import { Card, Text, Badge, Group, Stack, UnstyledButton } from '@mantine/core';
import { IconMapPin, IconVideo, IconCheck } from '@tabler/icons-react';
import type { ParsedLocation } from '@/types/booking';

interface LocationCardProps {
    location: ParsedLocation;
    selected?: boolean;
    onClick?: () => void;
}

export function LocationCard({ location, selected = false, onClick }: LocationCardProps) {
    const isOnline = location.locationType === 'online';

    return (
        <UnstyledButton onClick={onClick} style={{ width: '100%' }}>
            <Card
                withBorder
                padding="lg"
                radius="md"
                style={{
                    cursor: 'pointer',
                    borderColor: selected ? 'var(--mantine-color-blue-6)' : undefined,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: selected ? 'var(--mantine-color-blue-light)' : undefined,
                    transition: 'all 0.2s ease',
                }}
            >
                <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                        <Group gap="xs">
                            {isOnline ? (
                                <IconVideo size={20} style={{ color: 'var(--mantine-color-violet-6)' }} />
                            ) : (
                                <IconMapPin size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                            )}
                            <Text fw={600} size="md">{location.name}</Text>
                        </Group>
                        {selected && (
                            <IconCheck size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                        )}
                    </Group>

                    {isOnline ? (
                        <Badge variant="light" color="violet" size="sm">
                            Google Meet / Zoom
                        </Badge>
                    ) : (
                        <Stack gap={4}>
                            {location.address && (
                                <Text size="sm" c="dimmed">{location.address}</Text>
                            )}
                            {(location.city || location.countryRegion) && (
                                <Text size="sm" c="dimmed">
                                    {[location.city, location.countryRegion, location.postalCode]
                                        .filter(Boolean)
                                        .join(', ')}
                                </Text>
                            )}
                        </Stack>
                    )}
                </Stack>
            </Card>
        </UnstyledButton>
    );
}
