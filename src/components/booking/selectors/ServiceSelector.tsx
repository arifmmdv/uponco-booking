// ============================================================================
// Service Selector Component
// Simplified - renders only the selection grid (header is in accordion)
// ============================================================================

'use client';

import { SimpleGrid, Text, Stack } from '@mantine/core';
import { ServiceCard } from '@/components/cards';
import type { ParsedService } from '@/types/booking';

interface ServiceSelectorProps {
    services: ParsedService[];
    selectedServiceId: string | null;
    onSelect: (serviceId: string) => void;
}

export function ServiceSelector({
    services,
    selectedServiceId,
    onSelect,
}: ServiceSelectorProps) {
    if (services.length === 0) {
        return (
            <Text c="dimmed" size="sm" ta="center" py="md">
                No services available
            </Text>
        );
    }

    return (
        <Stack gap="sm">
            <SimpleGrid cols={{ base: 1 }} spacing="sm">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        selected={selectedServiceId === service.id}
                        onClick={() => onSelect(service.id)}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
}
