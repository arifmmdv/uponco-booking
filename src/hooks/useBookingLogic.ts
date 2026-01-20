// ============================================================================
// useBookingLogic Hook
// Smart booking flow logic with accordion step state machine
// ============================================================================

'use client';

import { useReducer, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ParsedCompany, ParsedLocation, ParsedService, ParsedSpecialist } from '@/types/booking';
import { validateUrlCombination, getFilteredOptions } from '@/utils/filtering';

// ============================================================================
// Step Types
// ============================================================================

export type StepId = 'location' | 'service' | 'specialist' | 'datetime' | 'contact';
export type StepState = 'completed' | 'current' | 'pending';

export interface StepStatus {
    location: StepState;
    service: StepState;
    specialist: StepState;
    datetime: StepState;
    contact: StepState;
}

// ============================================================================
// State Types
// ============================================================================

interface BookingLogicState {
    // Locked values (from URL - displayed but not changeable)
    lockedLocation: boolean;
    lockedService: boolean;
    lockedSpecialist: boolean;

    // Current selections
    locationId: string | null;
    serviceId: string | null;
    specialistId: string | null;
    date: Date | null;
    time: string | null;

    // Current active step (for accordion control)
    currentStep: StepId;

    // Validation
    isValid: boolean;
    validationError: string | null;

    // Status
    isInitialized: boolean;
    isComplete: boolean;
}

type BookingAction =
    | { type: 'INIT_FROM_URL'; payload: Partial<BookingLogicState> }
    | { type: 'SET_VALIDATION_ERROR'; payload: string }
    | { type: 'SELECT_LOCATION'; payload: string }
    | { type: 'SELECT_SERVICE'; payload: string }
    | { type: 'SELECT_SPECIALIST'; payload: string }
    | { type: 'SELECT_DATE'; payload: Date }
    | { type: 'SELECT_TIME'; payload: string }
    | { type: 'GO_TO_STEP'; payload: StepId }
    | { type: 'COMPLETE_BOOKING' }
    | { type: 'RESET' };

// ============================================================================
// Initial State
// ============================================================================

const initialState: BookingLogicState = {
    lockedLocation: false,
    lockedService: false,
    lockedSpecialist: false,
    locationId: null,
    serviceId: null,
    specialistId: null,
    date: null,
    time: null,
    currentStep: 'location',
    isValid: true,
    validationError: null,
    isInitialized: false,
    isComplete: false,
};

// ============================================================================
// Helper to determine next step after selection
// ============================================================================

function getNextStep(currentStep: StepId, state: BookingLogicState): StepId {
    const steps: StepId[] = ['location', 'service', 'specialist', 'datetime', 'contact'];
    const currentIndex = steps.indexOf(currentStep);

    // Skip locked steps
    for (let i = currentIndex + 1; i < steps.length; i++) {
        const nextStep = steps[i];
        if (nextStep === 'location' && state.lockedLocation) continue;
        if (nextStep === 'service' && state.lockedService) continue;
        if (nextStep === 'specialist' && state.lockedSpecialist) continue;
        return nextStep;
    }

    return steps[steps.length - 1];
}

function getFirstUnlockedStep(state: BookingLogicState): StepId {
    if (!state.lockedLocation) return 'location';
    if (!state.lockedService) return 'service';
    if (!state.lockedSpecialist) return 'specialist';
    return 'datetime';
}

// ============================================================================
// Reducer
// ============================================================================

function bookingReducer(state: BookingLogicState, action: BookingAction): BookingLogicState {
    switch (action.type) {
        case 'INIT_FROM_URL': {
            const newState = {
                ...state,
                ...action.payload,
                isInitialized: true,
            };
            // Determine first available step
            newState.currentStep = getFirstUnlockedStep(newState);
            return newState;
        }

        case 'SET_VALIDATION_ERROR':
            return {
                ...state,
                isValid: false,
                validationError: action.payload,
                isInitialized: true,
            };

        case 'SELECT_LOCATION': {
            const newState = {
                ...state,
                locationId: action.payload,
                // Clear downstream values (fix selection loop)
                serviceId: state.lockedService ? state.serviceId : null,
                specialistId: state.lockedSpecialist ? state.specialistId : null,
                date: null,
                time: null,
            };
            // Move to next step
            newState.currentStep = getNextStep('location', newState);
            return newState;
        }

        case 'SELECT_SERVICE': {
            const newState = {
                ...state,
                serviceId: action.payload,
                // Clear downstream values
                specialistId: state.lockedSpecialist ? state.specialistId : null,
                date: null,
                time: null,
            };
            // Move to next step
            newState.currentStep = getNextStep('service', newState);
            return newState;
        }

        case 'SELECT_SPECIALIST': {
            const newState = {
                ...state,
                specialistId: action.payload,
                date: null,
                time: null,
            };
            // Move to next step
            newState.currentStep = getNextStep('specialist', newState);
            return newState;
        }

        case 'SELECT_DATE':
            return {
                ...state,
                date: action.payload,
                time: null,
            };

        case 'SELECT_TIME':
            return {
                ...state,
                time: action.payload,
                currentStep: 'contact',
            };

        case 'GO_TO_STEP':
            return {
                ...state,
                currentStep: action.payload,
            };

        case 'COMPLETE_BOOKING':
            return {
                ...state,
                isComplete: true,
            };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

// ============================================================================
// Hook
// ============================================================================

export function useBookingLogic(company: ParsedCompany | null | undefined) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);
    const searchParams = useSearchParams();
    const hasInitialized = useRef(false);

    // Initialize from URL params (ONCE only)
    useEffect(() => {
        if (!company || hasInitialized.current) return;
        hasInitialized.current = true;

        const locationParam = searchParams.get('location');
        const serviceParam = searchParams.get('service');
        const specialistParam = searchParams.get('specialist');

        // If no params, just mark as initialized
        if (!locationParam && !serviceParam && !specialistParam) {
            dispatch({ type: 'INIT_FROM_URL', payload: {} });
            return;
        }

        // Validate the combination
        const validation = validateUrlCombination(company, {
            locationId: locationParam,
            serviceId: serviceParam,
            specialistId: specialistParam,
        });

        if (!validation.valid) {
            dispatch({ type: 'SET_VALIDATION_ERROR', payload: validation.error || 'Invalid booking link' });
            return;
        }

        // Build initial state from valid params
        const updates: Partial<BookingLogicState> = {
            isValid: true,
            validationError: null,
        };

        if (locationParam && company.locationMap.has(locationParam)) {
            updates.locationId = locationParam;
            updates.lockedLocation = true;
        }

        if (serviceParam && company.serviceMap.has(serviceParam)) {
            updates.serviceId = serviceParam;
            updates.lockedService = true;
        }

        if (specialistParam && company.specialistMap.has(specialistParam)) {
            updates.specialistId = specialistParam;
            updates.lockedSpecialist = true;
        }

        dispatch({ type: 'INIT_FROM_URL', payload: updates });
    }, [company, searchParams]);

    // Get filtered options based on current selections
    const filteredOptions = useMemo(() => {
        if (!company) {
            return { locations: [], services: [], specialists: [] };
        }

        return getFilteredOptions(company, {
            locationId: state.locationId,
            serviceId: state.serviceId,
            specialistId: state.specialistId,
        });
    }, [company, state.locationId, state.serviceId, state.specialistId]);

    // Compute step statuses for accordion
    const stepStatus = useMemo((): StepStatus => {
        const hasLocation = Boolean(state.locationId) || state.lockedLocation;
        const hasService = Boolean(state.serviceId) || state.lockedService;
        const hasSpecialist = Boolean(state.specialistId) || state.lockedSpecialist;
        const hasDateTime = Boolean(state.date && state.time);

        // Determine each step's state
        const getStepState = (stepId: StepId): StepState => {
            // If this is the current step, it's 'current'
            if (state.currentStep === stepId) return 'current';

            // Check completion status
            switch (stepId) {
                case 'location':
                    return hasLocation ? 'completed' : 'pending';
                case 'service':
                    return hasService ? 'completed' : 'pending';
                case 'specialist':
                    return hasSpecialist ? 'completed' : 'pending';
                case 'datetime':
                    return hasDateTime ? 'completed' : 'pending';
                case 'contact':
                    return 'pending';
                default:
                    return 'pending';
            }
        };

        return {
            location: getStepState('location'),
            service: getStepState('service'),
            specialist: getStepState('specialist'),
            datetime: getStepState('datetime'),
            contact: getStepState('contact'),
        };
    }, [state]);

    // Check if a step is accessible (can be clicked/expanded)
    const isStepAccessible = useCallback((stepId: StepId): boolean => {
        // Locked steps are never accessible in accordion
        if (stepId === 'location' && state.lockedLocation) return false;
        if (stepId === 'service' && state.lockedService) return false;
        if (stepId === 'specialist' && state.lockedSpecialist) return false;

        // Current step is always accessible
        if (state.currentStep === stepId) return true;

        // Completed steps are accessible (for editing)
        if (stepStatus[stepId] === 'completed') return true;

        // Check prerequisites
        switch (stepId) {
            case 'location':
                return true;
            case 'service':
                return Boolean(state.locationId) || state.lockedLocation;
            case 'specialist':
                return (Boolean(state.locationId) || state.lockedLocation) &&
                    (Boolean(state.serviceId) || state.lockedService);
            case 'datetime':
                return (Boolean(state.locationId) || state.lockedLocation) &&
                    (Boolean(state.serviceId) || state.lockedService) &&
                    (Boolean(state.specialistId) || state.lockedSpecialist);
            case 'contact':
                return Boolean(state.date && state.time);
            default:
                return false;
        }
    }, [state, stepStatus]);

    // Computed values
    const isSelectionComplete = Boolean(
        (state.locationId || state.lockedLocation) &&
        (state.serviceId || state.lockedService) &&
        (state.specialistId || state.lockedSpecialist)
    );

    const selectedLocation = useMemo(
        () => (state.locationId ? company?.locationMap.get(state.locationId) ?? null : null),
        [company, state.locationId]
    );

    const selectedService = useMemo(
        () => (state.serviceId ? company?.serviceMap.get(state.serviceId) ?? null : null),
        [company, state.serviceId]
    );

    const selectedSpecialist = useMemo(
        () => (state.specialistId ? company?.specialistMap.get(state.specialistId) ?? null : null),
        [company, state.specialistId]
    );

    // Determine which steps should be shown in accordion (non-locked)
    const showLocationStep = !state.lockedLocation;
    const showServiceStep = !state.lockedService;
    const showSpecialistStep = !state.lockedSpecialist;

    // Actions
    const selectLocation = useCallback((locationId: string) => {
        dispatch({ type: 'SELECT_LOCATION', payload: locationId });
    }, []);

    const selectService = useCallback((serviceId: string) => {
        dispatch({ type: 'SELECT_SERVICE', payload: serviceId });
    }, []);

    const selectSpecialist = useCallback((specialistId: string) => {
        dispatch({ type: 'SELECT_SPECIALIST', payload: specialistId });
    }, []);

    const selectDate = useCallback((date: Date) => {
        dispatch({ type: 'SELECT_DATE', payload: date });
    }, []);

    const selectTime = useCallback((time: string) => {
        dispatch({ type: 'SELECT_TIME', payload: time });
    }, []);

    const goToStep = useCallback((stepId: StepId) => {
        dispatch({ type: 'GO_TO_STEP', payload: stepId });
    }, []);

    const completeBooking = useCallback(() => {
        dispatch({ type: 'COMPLETE_BOOKING' });
    }, []);

    const reset = useCallback(() => {
        hasInitialized.current = false;
        dispatch({ type: 'RESET' });
    }, []);

    return {
        // State
        state,
        isInitialized: state.isInitialized,
        isValid: state.isValid,
        validationError: state.validationError,
        isComplete: state.isComplete,

        // Step tracking
        currentStep: state.currentStep,
        stepStatus,
        isStepAccessible,

        // Locked status
        lockedLocation: state.lockedLocation,
        lockedService: state.lockedService,
        lockedSpecialist: state.lockedSpecialist,

        // Raw values
        locationId: state.locationId,
        serviceId: state.serviceId,
        specialistId: state.specialistId,
        date: state.date,
        time: state.time,

        // Resolved entities
        selectedLocation,
        selectedService,
        selectedSpecialist,

        // Filtered options
        filteredLocations: filteredOptions.locations,
        filteredServices: filteredOptions.services,
        filteredSpecialists: filteredOptions.specialists,

        // Step visibility (for accordion)
        showLocationStep,
        showServiceStep,
        showSpecialistStep,
        isSelectionComplete,

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

// Export types for consumers
export type { BookingLogicState };
