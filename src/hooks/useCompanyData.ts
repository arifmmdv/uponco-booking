// ============================================================================
// useCompanyData Hook
// Fetches company data using React Query
// ============================================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCompanyBySlug } from '@/lib/mock/api';
import type { ParsedCompany } from '@/types/booking';

interface UseCompanyDataOptions {
    enabled?: boolean;
}

export function useCompanyData(slug: string, options: UseCompanyDataOptions = {}) {
    const { enabled = true } = options;

    return useQuery<ParsedCompany | null>({
        queryKey: ['company', slug],
        queryFn: () => fetchCompanyBySlug(slug),
        enabled,
    });
}
