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

// ============================================================================
// Reverse Lookup Functions (for flexible entry points)
// ============================================================================

/**
 * Get locations where a specific specialist works
 */
export function getLocationsForSpecialist(
    company: ParsedCompany,
    specialistId: string | null
): ParsedLocation[] {
    if (!specialistId) {
        return company.locations;
    }

    const specialist = company.specialistMap.get(specialistId);
    if (!specialist) {
        return company.locations;
    }

    return company.locations.filter(location =>
        specialist.locationIds.includes(location.id)
    );
}

/**
 * Get services a specific specialist can perform
 */
export function getServicesForSpecialist(
    company: ParsedCompany,
    specialistId: string | null
): ParsedService[] {
    if (!specialistId) {
        return company.services;
    }

    const specialist = company.specialistMap.get(specialistId);
    if (!specialist) {
        return company.services;
    }

    return company.services.filter(service =>
        specialist.serviceIds.includes(service.id)
    );
}

/**
 * Get specialists who can perform a specific service (regardless of location)
 */
export function getSpecialistsForService(
    company: ParsedCompany,
    serviceId: string | null
): ParsedSpecialist[] {
    if (!serviceId) {
        return company.specialists;
    }

    return company.specialists.filter(specialist =>
        specialist.serviceIds.includes(serviceId)
    );
}

// ============================================================================
// URL Validation
// ============================================================================

interface ValidationResult {
    valid: boolean;
    error: string | null;
}

/**
 * Validate that a URL parameter combination is valid
 * Returns an error message if the combination is invalid
 */
export function validateUrlCombination(
    company: ParsedCompany,
    params: {
        locationId: string | null;
        serviceId: string | null;
        specialistId: string | null;
    }
): ValidationResult {
    const { locationId, serviceId, specialistId } = params;

    // Validate individual IDs exist
    if (locationId && !company.locationMap.has(locationId)) {
        return { valid: false, error: 'Location not found' };
    }
    if (serviceId && !company.serviceMap.has(serviceId)) {
        return { valid: false, error: 'Service not found' };
    }
    if (specialistId && !company.specialistMap.has(specialistId)) {
        return { valid: false, error: 'Specialist not found' };
    }

    // Validate location + service combination
    if (locationId && serviceId) {
        const service = company.serviceMap.get(serviceId)!;
        if (!service.locationIds.includes(locationId)) {
            const location = company.locationMap.get(locationId)!;
            return {
                valid: false,
                error: `${service.title} is not available at ${location.name}`,
            };
        }
    }

    // Validate location + specialist combination
    if (locationId && specialistId) {
        const specialist = company.specialistMap.get(specialistId)!;
        if (!specialist.locationIds.includes(locationId)) {
            const location = company.locationMap.get(locationId)!;
            return {
                valid: false,
                error: `${specialist.fullName} does not work at ${location.name}`,
            };
        }
    }

    // Validate service + specialist combination
    if (serviceId && specialistId) {
        const specialist = company.specialistMap.get(specialistId)!;
        if (!specialist.serviceIds.includes(serviceId)) {
            const service = company.serviceMap.get(serviceId)!;
            return {
                valid: false,
                error: `${specialist.fullName} does not perform ${service.title}`,
            };
        }
    }

    // Validate all three together
    if (locationId && serviceId && specialistId) {
        const specialist = company.specialistMap.get(specialistId)!;
        const service = company.serviceMap.get(serviceId)!;
        
        // Check specialist works at location AND can do service
        const worksAtLocation = specialist.locationIds.includes(locationId);
        const canDoService = specialist.serviceIds.includes(serviceId);
        const serviceAtLocation = service.locationIds.includes(locationId);

        if (!worksAtLocation || !canDoService || !serviceAtLocation) {
            return {
                valid: false,
                error: 'This combination of location, service, and specialist is not available',
            };
        }
    }

    return { valid: true, error: null };
}

// ============================================================================
// Smart Filtering (based on current selections)
// ============================================================================

/**
 * Get all filtered options based on current selections
 * Handles any combination of pre-selected values
 */
export function getFilteredOptions(
    company: ParsedCompany,
    params: {
        locationId: string | null;
        serviceId: string | null;
        specialistId: string | null;
    }
): {
    locations: ParsedLocation[];
    services: ParsedService[];
    specialists: ParsedSpecialist[];
} {
    const { locationId, serviceId, specialistId } = params;

    let locations = company.locations;
    let services = company.services;
    let specialists = company.specialists;

    // Filter by specialist first (most restrictive)
    if (specialistId) {
        const specialist = company.specialistMap.get(specialistId);
        if (specialist) {
            locations = locations.filter(l => specialist.locationIds.includes(l.id));
            services = services.filter(s => specialist.serviceIds.includes(s.id));
        }
    }

    // Filter by service
    if (serviceId) {
        const service = company.serviceMap.get(serviceId);
        if (service) {
            locations = locations.filter(l => service.locationIds.includes(l.id));
            specialists = specialists.filter(s => s.serviceIds.includes(serviceId));
        }
    }

    // Filter by location
    if (locationId) {
        services = services.filter(s => s.locationIds.includes(locationId));
        specialists = specialists.filter(s => s.locationIds.includes(locationId));
    }

    return { locations, services, specialists };
}
