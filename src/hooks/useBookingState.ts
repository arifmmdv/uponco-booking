// ============================================================================
// useBookingState Hook
// Manages booking flow state with URL sync
// ============================================================================

'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ParsedCompany, BookingStep } from '@/types/booking';
import {
    checkAutoSelectService,
    checkAutoSelectSpecialist,
} from '@/utils/filtering';

// ============================================================================
// State Types
// ============================================================================

interface BookingState {
    step: BookingStep;
    locationId: string | null;
    serviceId: string | null;
    specialistId: string | null;
    date: Date | null;
    time: string | null;
    isComplete: boolean;
}

type BookingAction =
    | { type: 'SELECT_LOCATION'; payload: string }
    | { type: 'SELECT_SERVICE'; payload: string }
    | { type: 'SELECT_SPECIALIST'; payload: string }
    | { type: 'SELECT_DATE'; payload: Date }
    | { type: 'SELECT_TIME'; payload: string }
    | { type: 'GO_TO_STEP'; payload: BookingStep }
    | { type: 'COMPLETE_BOOKING' }
    | { type: 'RESET' }
    | { type: 'INIT_FROM_URL'; payload: Partial<BookingState> };

// ============================================================================
// Initial State
// ============================================================================

const initialState: BookingState = {
    step: 0, // BookingStep.LOCATION
    locationId: null,
    serviceId: null,
    specialistId: null,
    date: null,
    time: null,
    isComplete: false,
};

// ============================================================================
// Reducer
// ============================================================================

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SELECT_LOCATION':
            return {
                ...state,
                locationId: action.payload,
                // Reset downstream selections when location changes
                serviceId: null,
                specialistId: null,
                date: null,
                time: null,
                step: 1, // Move to service step
            };

        case 'SELECT_SERVICE':
            return {
                ...state,
                serviceId: action.payload,
                // Reset downstream selections
                specialistId: null,
                date: null,
                time: null,
                step: 2, // Move to specialist step
            };

        case 'SELECT_SPECIALIST':
            return {
                ...state,
                specialistId: action.payload,
                date: null,
                time: null,
                step: 3, // Move to date/time step
            };

        case 'SELECT_DATE':
            return {
                ...state,
                date: action.payload,
                time: null, // Reset time when date changes
            };

        case 'SELECT_TIME':
            return {
                ...state,
                time: action.payload,
                step: 4, // Move to contact step
            };

        case 'GO_TO_STEP':
            return {
                ...state,
                step: action.payload,
            };

        case 'COMPLETE_BOOKING':
            return {
                ...state,
                isComplete: true,
                step: 5, // Confirmation step
            };

        case 'RESET':
            return initialState;

        case 'INIT_FROM_URL':
            return {
                ...state,
                ...action.payload,
            };

        default:
            return state;
    }
}

// ============================================================================
// Hook
// ============================================================================

export function useBookingState(company: ParsedCompany | null | undefined) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL params on mount
    useEffect(() => {
        if (!company) return;

        const locationParam = searchParams.get('location');
        const serviceParam = searchParams.get('service');
        const specialistParam = searchParams.get('specialist');

        const updates: Partial<BookingState> = {};
        let step = 0;

        if (locationParam && company.locationMap.has(locationParam)) {
            updates.locationId = locationParam;
            step = 1;
        }

        if (serviceParam && company.serviceMap.has(serviceParam)) {
            updates.serviceId = serviceParam;
            step = 2;
        }

        if (specialistParam && company.specialistMap.has(specialistParam)) {
            updates.specialistId = specialistParam;
            step = 3;
        }

        if (Object.keys(updates).length > 0) {
            updates.step = step;
            dispatch({ type: 'INIT_FROM_URL', payload: updates });
        }
    }, [company, searchParams]);

    // Update URL when state changes
    const updateUrl = useCallback((newState: Partial<BookingState>) => {
        const params = new URLSearchParams();

        if (newState.locationId) params.set('location', newState.locationId);
        if (newState.serviceId) params.set('service', newState.serviceId);
        if (newState.specialistId) params.set('specialist', newState.specialistId);

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [pathname, router]);

    // Actions with auto-selection logic
    const selectLocation = useCallback((locationId: string) => {
        dispatch({ type: 'SELECT_LOCATION', payload: locationId });

        if (company) {
            // Check for auto-select service
            const autoService = checkAutoSelectService(company, locationId);
            if (autoService.shouldAutoSelect && autoService.selectedId) {
                // Delay to show the selection before auto-advancing
                setTimeout(() => {
                    dispatch({ type: 'SELECT_SERVICE', payload: autoService.selectedId! });

                    // Check for auto-select specialist
                    const autoSpecialist = checkAutoSelectSpecialist(company, autoService.selectedId, locationId);
                    if (autoSpecialist.shouldAutoSelect && autoSpecialist.selectedId) {
                        setTimeout(() => {
                            dispatch({ type: 'SELECT_SPECIALIST', payload: autoSpecialist.selectedId! });
                        }, 300);
                    }
                }, 300);
            }
        }

        updateUrl({ locationId, serviceId: null, specialistId: null });
    }, [company, updateUrl]);

    const selectService = useCallback((serviceId: string) => {
        dispatch({ type: 'SELECT_SERVICE', payload: serviceId });

        if (company) {
            // Check for auto-select specialist
            const autoSpecialist = checkAutoSelectSpecialist(company, serviceId, state.locationId);
            if (autoSpecialist.shouldAutoSelect && autoSpecialist.selectedId) {
                setTimeout(() => {
                    dispatch({ type: 'SELECT_SPECIALIST', payload: autoSpecialist.selectedId! });
                }, 300);
            }
        }

        updateUrl({ locationId: state.locationId, serviceId, specialistId: null });
    }, [company, state.locationId, updateUrl]);

    const selectSpecialist = useCallback((specialistId: string) => {
        dispatch({ type: 'SELECT_SPECIALIST', payload: specialistId });
        updateUrl({ locationId: state.locationId, serviceId: state.serviceId, specialistId });
    }, [state.locationId, state.serviceId, updateUrl]);

    const selectDate = useCallback((date: Date) => {
        dispatch({ type: 'SELECT_DATE', payload: date });
    }, []);

    const selectTime = useCallback((time: string) => {
        dispatch({ type: 'SELECT_TIME', payload: time });
    }, []);

    const goToStep = useCallback((step: BookingStep) => {
        dispatch({ type: 'GO_TO_STEP', payload: step });
    }, []);

    const completeBooking = useCallback(() => {
        dispatch({ type: 'COMPLETE_BOOKING' });
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
        router.replace(pathname, { scroll: false });
    }, [pathname, router]);

    // Computed values
    const selectedLocation = state.locationId ? company?.locationMap.get(state.locationId) : null;
    const selectedService = state.serviceId ? company?.serviceMap.get(state.serviceId) : null;
    const selectedSpecialist = state.specialistId ? company?.specialistMap.get(state.specialistId) : null;

    return {
        state,
        // Raw values
        locationId: state.locationId,
        serviceId: state.serviceId,
        specialistId: state.specialistId,
        date: state.date,
        time: state.time,
        step: state.step,
        isComplete: state.isComplete,
        // Resolved entities
        selectedLocation: selectedLocation ?? null,
        selectedService: selectedService ?? null,
        selectedSpecialist: selectedSpecialist ?? null,
        // Actions
        selectLocation,
        selectService,
        selectSpecialist,
        selectDate,
        selectTime,
        goToStep,
        completeBooking,
        reset,
    };
}
