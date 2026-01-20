// ============================================================================
// useAvailableSlots Hook
// Fetches available time slots using React Query
// ============================================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchAvailableSlots } from '@/lib/mock/api';
import type { ParsedSpecialist, TimeSlot } from '@/types/booking';

interface UseAvailableSlotsOptions {
    specialist: ParsedSpecialist | null;
    date: Date | null;
    serviceDuration: number;
    enabled?: boolean;
}

export function useAvailableSlots({
    specialist,
    date,
    serviceDuration,
    enabled = true,
}: UseAvailableSlotsOptions) {
    const dateKey = date ? dayjs(date).format('YYYY-MM-DD') : null;

    return useQuery<TimeSlot[]>({
        queryKey: ['availability', specialist?.id, dateKey, serviceDuration],
        queryFn: () => {
            if (!specialist || !date) {
                return Promise.resolve([]);
            }
            return fetchAvailableSlots(specialist, date, serviceDuration);
        },
        enabled: enabled && !!specialist && !!date,
    });
}
