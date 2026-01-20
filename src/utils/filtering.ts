// ============================================================================
// Filtering Utilities
// Location -> Service -> Specialist cascading filters
// ============================================================================

import type {
    ParsedLocation,
    ParsedService,
    ParsedSpecialist,
    ParsedCompany,
} from '@/types/booking';

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Get services available at a specific location
 */
export function getServicesForLocation(
    company: ParsedCompany,
    locationId: string | null
): ParsedService[] {
    if (!locationId) {
        return company.services;
    }

    return company.services.filter(service =>
        service.locationIds.includes(locationId)
    );
}

/**
 * Get specialists who can perform a specific service at a specific location
 */
export function getSpecialistsForServiceAndLocation(
    company: ParsedCompany,
    serviceId: string | null,
    locationId: string | null
): ParsedSpecialist[] {
    if (!serviceId) {
        return company.specialists;
    }

    return company.specialists.filter(specialist => {
        // Must be assigned to the service
        const canPerformService = specialist.serviceIds.includes(serviceId);

        // If location is specified, must work at that location
        const worksAtLocation = locationId
            ? specialist.locationIds.includes(locationId)
            : true;

        return canPerformService && worksAtLocation;
    });
}

/**
 * Get locations where a specific service is available
 */
export function getLocationsForService(
    company: ParsedCompany,
    serviceId: string | null
): ParsedLocation[] {
    if (!serviceId) {
        return company.locations;
    }

    const service = company.serviceMap.get(serviceId);
    if (!service) {
        return company.locations;
    }

    return company.locations.filter(location =>
        service.locationIds.includes(location.id)
    );
}

// ============================================================================
// Auto-Selection Logic
// ============================================================================

interface AutoSelectResult {
    shouldAutoSelect: boolean;
    selectedId: string | null;
}

/**
 * Check if auto-selection should happen (only 1 option available)
 */
export function checkAutoSelectService(
    company: ParsedCompany,
    locationId: string | null
): AutoSelectResult {
    const services = getServicesForLocation(company, locationId);

    if (services.length === 1) {
        return { shouldAutoSelect: true, selectedId: services[0].id };
    }

    return { shouldAutoSelect: false, selectedId: null };
}

export function checkAutoSelectSpecialist(
    company: ParsedCompany,
    serviceId: string | null,
    locationId: string | null
): AutoSelectResult {
    const specialists = getSpecialistsForServiceAndLocation(company, serviceId, locationId);

    if (specialists.length === 1) {
        return { shouldAutoSelect: true, selectedId: specialists[0].id };
    }

    return { shouldAutoSelect: false, selectedId: null };
}

export function checkAutoSelectLocation(
    company: ParsedCompany,
    serviceId: string | null
): AutoSelectResult {
    const locations = getLocationsForService(company, serviceId);

    if (locations.length === 1) {
        return { shouldAutoSelect: true, selectedId: locations[0].id };
    }

    return { shouldAutoSelect: false, selectedId: null };
}
