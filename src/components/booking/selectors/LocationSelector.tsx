// ============================================================================
// Location Selector Component
// Simplified - renders only the selection grid (header is in accordion)
// ============================================================================

'use client';

import { SimpleGrid, Text, Stack } from '@mantine/core';
import { LocationCard } from '@/components/cards';
import type { ParsedLocation } from '@/types/booking';

interface LocationSelectorProps {
    locations: ParsedLocation[];
    selectedLocationId: string | null;
    onSelect: (locationId: string) => void;
}

export function LocationSelector({
    locations,
    selectedLocationId,
    onSelect,
}: LocationSelectorProps) {
    if (locations.length === 0) {
        return (
            <Text c="dimmed" size="sm" ta="center" py="md">
                No locations available
            </Text>
        );
    }

    return (
        <Stack gap="sm">
            <SimpleGrid cols={{ base: 1 }} spacing="sm">
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
