// ============================================================================
// Location Step Component
// ============================================================================

'use client';

import { Stack, Text, SimpleGrid, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { LocationCard } from '@/components/cards';
import type { ParsedLocation } from '@/types/booking';

interface LocationStepProps {
    locations: ParsedLocation[];
    selectedLocationId: string | null;
    onSelect: (locationId: string) => void;
}

export function LocationStep({
    locations,
    selectedLocationId,
    onSelect,
}: LocationStepProps) {
    if (locations.length === 0) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                No locations available for this company.
            </Alert>
        );
    }

    return (
        <Stack gap="md">
            <Text size="lg" fw={500}>
                Select a location
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {locations.map((location) => (
                    <LocationCard
                        key={location.id}
                        location={location}
                        selected={selectedLocationId === location.id}
                        onClick={() => onSelect(location.id)}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
}
