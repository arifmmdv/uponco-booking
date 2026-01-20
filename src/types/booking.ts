// ============================================================================
// Parsed/Frontend Types - Clean, flat structures for UI consumption
// ============================================================================

// Work schedule types
export interface WorkBreak {
    startTime: string;
    endTime: string;
}

export interface WorkDay {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    breaks: WorkBreak[];
}

// Parsed entity types
export interface ParsedLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    countryRegion: string;
    postalCode: string;
    phone: string;
    locationType: 'physical' | 'online';
    specialistIds: string[]; // Specialists assigned to this location
}

export interface ParsedService {
    id: string;
    title: string;
    description: string;
    priceMin: number;
    priceMax: number;
    duration: number; // in minutes
    technicalBreak: number;
    serviceType: string;
    capacity: number;
    category: {
        id: string;
        title: string;
    } | null;
    locationIds: string[]; // Locations where this service is available
    specialistIds: string[]; // Specialists who can perform this service
}

export interface ParsedSpecialist {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    workSchedule: WorkDay[];
    locationIds: string[]; // Locations where this specialist works
    serviceIds: string[]; // Services this specialist can perform
}

export interface ParsedCompany {
    id: string;
    name: string;
    locations: ParsedLocation[];
    services: ParsedService[];
    specialists: ParsedSpecialist[];
    // Lookup maps for efficient filtering
    locationMap: Map<string, ParsedLocation>;
    serviceMap: Map<string, ParsedService>;
    specialistMap: Map<string, ParsedSpecialist>;
}

// Time slot type
export interface TimeSlot {
    time: string; // HH:MM format
    available: boolean;
}

// Booking state
export interface BookingState {
    step: number;
    selectedLocationId: string | null;
    selectedServiceId: string | null;
    selectedSpecialistId: string | null;
    selectedDate: Date | null;
    selectedTime: string | null;
}

// Contact form data
export interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
    comment: string;
}

// Final booking payload (for console.log on submit)
export interface BookingPayload {
    companyId: string;
    location: ParsedLocation | null;
    service: ParsedService;
    specialist: ParsedSpecialist;
    appointmentTime: string; // ISO string
    contact: ContactFormData;
}

// Booking step enum
export enum BookingStep {
    LOCATION = 0,
    SERVICE = 1,
    SPECIALIST = 2,
    DATE_TIME = 3,
    CONTACT = 4,
    CONFIRMATION = 5,
}

// Filter result types
export interface FilteredOptions {
    locations: ParsedLocation[];
    services: ParsedService[];
    specialists: ParsedSpecialist[];
}
