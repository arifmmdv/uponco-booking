// ============================================================================
// Company Data Parser
// Transforms raw Supabase response into clean frontend types
// When switching databases, only update this file
// ============================================================================

import type {
    SupabaseCompanyResponse,
    SupabaseProfile,
    SupabaseWorkHours,
} from '@/types/database';
import type {
    ParsedCompany,
    ParsedLocation,
    ParsedService,
    ParsedSpecialist,
    WorkDay,
    WorkBreak,
} from '@/types/booking';

// ============================================================================
// Parser Error Types
// ============================================================================

export class ParserError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ParserError';
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

function parseWorkBreaks(workHours: SupabaseWorkHours): WorkBreak[] {
    if (!workHours.users_work_breaks) return [];

    return workHours.users_work_breaks
        .filter(wb => wb.startTime && wb.endTime)
        .map(wb => ({
            startTime: wb.startTime!,
            endTime: wb.endTime!,
        }));
}

function parseWorkSchedule(
    workHours: SupabaseWorkHours[],
    companyId: string
): WorkDay[] {
    if (!workHours) return [];

    return workHours
        .filter(wh => wh.companyId === companyId && wh.dayOfWeek !== null)
        .map(wh => ({
            dayOfWeek: wh.dayOfWeek!,
            startTime: wh.startTime || '09:00',
            endTime: wh.endTime || '17:00',
            breaks: parseWorkBreaks(wh),
        }));
}

function parseLocation(
    location: SupabaseCompanyResponse['locations'][0]
): ParsedLocation {
    return {
        id: location.id,
        name: location.name || 'Unnamed Location',
        address: '',  // Will be populated from full location data if available
        city: '',
        countryRegion: '',
        postalCode: '',
        phone: '',
        locationType: 'physical',
        specialistIds: location.profile_locations?.map(pl => pl.profileId) || [],
    };
}

function parseService(
    service: SupabaseCompanyResponse['services'][0]
): ParsedService {
    return {
        id: service.id,
        title: service.title || 'Unnamed Service',
        description: service.description || '',
        priceMin: service.priceMin || 0,
        priceMax: service.priceMax || 0,
        duration: service.duration || 60,
        technicalBreak: service.technicalBreak || 0,
        serviceType: service.serviceType,
        capacity: service.capacity || 1,
        category: service.service_categories
            ? {
                id: service.service_categories.id,
                title: service.service_categories.title || '',
            }
            : null,
        locationIds: service.service_locations?.map(sl => sl.locationId) || [],
        specialistIds: service.service_assignments?.map(sa => sa.profileId) || [],
    };
}

function parseSpecialist(
    profile: SupabaseProfile,
    companyId: string,
    serviceAssignments: Map<string, string[]>,
    locationAssignments: Map<string, string[]>
): ParsedSpecialist {
    return {
        id: profile.id,
        fullName: profile.fullName || 'Unknown Specialist',
        email: profile.email,
        avatarUrl: '',
        workSchedule: parseWorkSchedule(profile.users_work_hours || [], companyId),
        locationIds: locationAssignments.get(profile.id) || [],
        serviceIds: serviceAssignments.get(profile.id) || [],
    };
}

// ============================================================================
// Main Parser Function
// ============================================================================

export function parseCompanyData(
    raw: SupabaseCompanyResponse | null
): ParsedCompany {
    // Handle null/undefined input
    if (!raw) {
        throw new ParserError('Company data is null or undefined');
    }

    // Validate required fields
    if (!raw.id) {
        throw new ParserError('Company ID is missing', 'id');
    }

    // Build service assignments map (profileId -> serviceIds[])
    const serviceAssignments = new Map<string, string[]>();
    for (const service of raw.services || []) {
        for (const assignment of service.service_assignments || []) {
            const existing = serviceAssignments.get(assignment.profileId) || [];
            existing.push(service.id);
            serviceAssignments.set(assignment.profileId, existing);
        }
    }

    // Build location assignments map (profileId -> locationIds[])
    const locationAssignments = new Map<string, string[]>();
    for (const location of raw.locations || []) {
        for (const profileLocation of location.profile_locations || []) {
            const existing = locationAssignments.get(profileLocation.profileId) || [];
            existing.push(location.id);
            locationAssignments.set(profileLocation.profileId, existing);
        }
    }

    // Parse locations
    const locations: ParsedLocation[] = (raw.locations || []).map(parseLocation);

    // Parse services
    const services: ParsedService[] = (raw.services || []).map(parseService);

    // Parse specialists from role_user
    const specialists: ParsedSpecialist[] = [];
    for (const roleUser of raw.role_user || []) {
        if (roleUser.profiles) {
            specialists.push(
                parseSpecialist(
                    roleUser.profiles,
                    raw.id,
                    serviceAssignments,
                    locationAssignments
                )
            );
        }
    }

    // Build lookup maps
    const locationMap = new Map<string, ParsedLocation>();
    for (const loc of locations) {
        locationMap.set(loc.id, loc);
    }

    const serviceMap = new Map<string, ParsedService>();
    for (const svc of services) {
        serviceMap.set(svc.id, svc);
    }

    const specialistMap = new Map<string, ParsedSpecialist>();
    for (const spec of specialists) {
        specialistMap.set(spec.id, spec);
    }

    return {
        id: raw.id,
        name: raw.name || 'Unnamed Company',
        locations,
        services,
        specialists,
        locationMap,
        serviceMap,
        specialistMap,
    };
}

// ============================================================================
// Utility: Create empty parsed company (for error states)
// ============================================================================

export function createEmptyCompany(): ParsedCompany {
    return {
        id: '',
        name: '',
        locations: [],
        services: [],
        specialists: [],
        locationMap: new Map(),
        serviceMap: new Map(),
        specialistMap: new Map(),
    };
}
