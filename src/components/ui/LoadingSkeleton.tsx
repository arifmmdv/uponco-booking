// ============================================================================
// Loading Skeleton Components
// ============================================================================

'use client';

import { Skeleton, Stack, Group, Card, SimpleGrid } from '@mantine/core';

export function CardSkeleton() {
    return (
        <Card withBorder>
            <Stack gap="sm">
                <Skeleton height={20} width="60%" />
                <Skeleton height={14} width="80%" />
                <Skeleton height={14} width="40%" />
            </Stack>
        </Card>
    );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </SimpleGrid>
    );
}

export function TimeSlotsSkeleton() {
    return (
        <Group gap="xs">
            {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={40} width={70} radius="md" />
            ))}
        </Group>
    );
}

export function StepperSkeleton() {
    return (
        <Stack gap="xl">
            <Group gap="md">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={12} width={100} radius="xl" />
                ))}
            </Group>
            <CardGridSkeleton count={3} />
        </Stack>
    );
}
