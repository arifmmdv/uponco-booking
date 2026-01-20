// ============================================================================
// Mock API Functions
// Simulates API calls with realistic delays
// ============================================================================

import { mockCompanyData, locationDetails } from './data';
import { parseCompanyData } from '@/lib/parser/companyDataParser';
import { getAvailableSlots } from './availability';
import type { ParsedCompany, TimeSlot, ParsedSpecialist } from '@/types/booking';

// ============================================================================
// Simulated Network Delay
// ============================================================================

const MOCK_DELAY_MS = 500;

async function simulateNetworkDelay<T>(data: T): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    return data;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch company data by slug
 */
export async function fetchCompanyBySlug(slug: string): Promise<ParsedCompany | null> {
    // In real implementation, this would call Supabase
    // For mock, we only have 'uponco' company
    if (slug !== 'uponco') {
        return simulateNetworkDelay(null);
    }

    const parsed = parseCompanyData(mockCompanyData);

    // Enhance locations with full details
    for (const location of parsed.locations) {
        const details = locationDetails[location.id];
        if (details) {
            location.address = details.address;
            location.city = details.city;
            location.countryRegion = details.countryRegion;
            location.postalCode = details.postalCode;
            location.phone = details.phone;
            location.locationType = details.locationType;
        }
    }

    return simulateNetworkDelay(parsed);
}

/**
 * Fetch available time slots for a specialist on a specific date
 */
export async function fetchAvailableSlots(
    specialist: ParsedSpecialist,
    date: Date,
    serviceDuration: number
): Promise<TimeSlot[]> {
    const slots = getAvailableSlots({
        specialist,
        date,
        serviceDuration,
    });

    return simulateNetworkDelay(slots);
}

/**
 * Submit booking (mock - just logs to console)
 */
export async function submitBooking(payload: unknown): Promise<{ success: boolean; bookingId: string }> {
    console.log('='.repeat(60));
    console.log('BOOKING SUBMISSION');
    console.log('='.repeat(60));
    console.log(JSON.stringify(payload, null, 2));
    console.log('='.repeat(60));

    return simulateNetworkDelay({
        success: true,
        bookingId: `booking-${Date.now()}`,
    });
}
