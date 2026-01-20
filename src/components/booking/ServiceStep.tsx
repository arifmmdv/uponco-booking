// ============================================================================
// Service Step Component
// ============================================================================

'use client';

import { Stack, Text, SimpleGrid, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ServiceCard } from '@/components/cards';
import type { ParsedService } from '@/types/booking';

interface ServiceStepProps {
    services: ParsedService[];
    selectedServiceId: string | null;
    onSelect: (serviceId: string) => void;
}

export function ServiceStep({
    services,
    selectedServiceId,
    onSelect,
}: ServiceStepProps) {
    if (services.length === 0) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                No services available at the selected location.
            </Alert>
        );
    }

    return (
        <Stack gap="md">
            <Text size="lg" fw={500}>
                Select a service
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
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
