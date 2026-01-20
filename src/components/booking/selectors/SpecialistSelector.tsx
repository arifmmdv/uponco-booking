// ============================================================================
// Specialist Selector Component
// Simplified - renders only the selection grid (header is in accordion)
// ============================================================================

'use client';

import { SimpleGrid, Text, Stack } from '@mantine/core';
import { SpecialistCard } from '@/components/cards';
import type { ParsedSpecialist } from '@/types/booking';

interface SpecialistSelectorProps {
    specialists: ParsedSpecialist[];
    selectedSpecialistId: string | null;
    onSelect: (specialistId: string) => void;
}

export function SpecialistSelector({
    specialists,
    selectedSpecialistId,
    onSelect,
}: SpecialistSelectorProps) {
    if (specialists.length === 0) {
        return (
            <Text c="dimmed" size="sm" ta="center" py="md">
                No specialists available
            </Text>
        );
    }

    return (
        <Stack gap="sm">
            <SimpleGrid cols={{ base: 1 }} spacing="sm">
                {specialists.map((specialist) => (
                    <SpecialistCard
                        key={specialist.id}
                        specialist={specialist}
                        selected={selectedSpecialistId === specialist.id}
                        onClick={() => onSelect(specialist.id)}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
}
