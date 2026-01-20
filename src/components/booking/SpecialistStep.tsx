// ============================================================================
// Specialist Step Component
// ============================================================================

'use client';

import { Stack, Text, SimpleGrid, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { SpecialistCard } from '@/components/cards';
import type { ParsedSpecialist } from '@/types/booking';

interface SpecialistStepProps {
    specialists: ParsedSpecialist[];
    selectedSpecialistId: string | null;
    onSelect: (specialistId: string) => void;
}

export function SpecialistStep({
    specialists,
    selectedSpecialistId,
    onSelect,
}: SpecialistStepProps) {
    if (specialists.length === 0) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                No specialists available for the selected service.
            </Alert>
        );
    }

    return (
        <Stack gap="md">
            <Text size="lg" fw={500}>
                Select a specialist
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
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
