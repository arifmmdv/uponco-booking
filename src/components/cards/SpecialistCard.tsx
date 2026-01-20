// ============================================================================
// Specialist Card Component
// ============================================================================

'use client';

import { Card, Text, Avatar, Group, Stack, UnstyledButton } from '@mantine/core';
import { IconCheck, IconMail } from '@tabler/icons-react';
import type { ParsedSpecialist } from '@/types/booking';

interface SpecialistCardProps {
    specialist: ParsedSpecialist;
    selected?: boolean;
    onClick?: () => void;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function SpecialistCard({ specialist, selected = false, onClick }: SpecialistCardProps) {
    return (
        <UnstyledButton onClick={onClick} style={{ width: '100%' }}>
            <Card
                withBorder
                padding="lg"
                radius="md"
                style={{
                    cursor: 'pointer',
                    borderColor: selected ? 'var(--mantine-color-violet-6)' : undefined,
                    borderWidth: selected ? 2 : 1,
                    backgroundColor: selected ? 'var(--mantine-color-violet-light)' : undefined,
                    transition: 'all 0.2s ease',
                }}
            >
                <Group gap="md" justify="space-between">
                    <Group gap="md">
                        <Avatar
                            size="lg"
                            radius="xl"
                            src={specialist.avatarUrl || undefined}
                            color="violet"
                        >
                            {getInitials(specialist.fullName)}
                        </Avatar>
                        <Stack gap={4}>
                            <Text fw={600} size="md">{specialist.fullName}</Text>
                            <Group gap={4}>
                                <IconMail size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                                <Text size="sm" c="dimmed">{specialist.email}</Text>
                            </Group>
                        </Stack>
                    </Group>
                    {selected && (
                        <IconCheck size={20} style={{ color: 'var(--mantine-color-violet-6)' }} />
                    )}
                </Group>
            </Card>
        </UnstyledButton>
    );
}
