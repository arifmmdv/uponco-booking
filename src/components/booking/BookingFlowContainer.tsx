// ============================================================================
// Booking Flow Container
// Main container with Accordion layout and state-derived flow
// ============================================================================

'use client';

import { Suspense, useState, useCallback } from 'react';
import {
    Box,
    Stack,
    Paper,
    Title,
    Text,
    Alert,
    Accordion,
    ScrollArea,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useCompanyData, useBookingLogic } from '@/hooks';
import { submitBooking } from '@/lib/mock/api';
import { CardGridSkeleton } from '@/components/ui';
import { LocationSelector, ServiceSelector, SpecialistSelector } from './selectors';
import { BookingSummary } from './BookingSummary';
import { BrandingSection } from './BrandingSection';
import { DateTimeStep } from './DateTimeStep';
import { ContactInfoStep } from './ContactInfoStep';
import { SuccessCard } from './SuccessCard';
import { AccordionHeader } from './AccordionHeader';
import type { ContactFormValues } from '@/utils/validation';
import type { BookingPayload, ContactFormData } from '@/types/booking';
import type { StepId } from '@/hooks/useBookingLogic';

interface BookingFlowContainerProps {
    companySlug: string;
}

function BookingFlowContent({ companySlug }: BookingFlowContainerProps) {
    const { data: company, isLoading, error } = useCompanyData(companySlug);
    const booking = useBookingLogic(company);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedContact, setSubmittedContact] = useState<ContactFormData | null>(null);

    // Handle accordion change
    const handleAccordionChange = useCallback((value: string | null) => {
        if (value && booking.isStepAccessible(value as StepId)) {
            booking.goToStep(value as StepId);
        }
    }, [booking]);

    // Handle form submission
    const handleSubmit = useCallback(async (values: ContactFormValues) => {
        if (!company || !booking.selectedService || !booking.selectedSpecialist || !booking.date || !booking.time) {
            return;
        }

        setIsSubmitting(true);

        const payload: BookingPayload = {
            companyId: company.id,
            location: booking.selectedLocation,
            service: booking.selectedService,
            specialist: booking.selectedSpecialist,
            appointmentTime: `${booking.date.toISOString().split('T')[0]}T${booking.time}:00`,
            contact: values,
        };

        try {
            await submitBooking(payload);
            setSubmittedContact(values);
            booking.completeBooking();
        } catch (err) {
            console.error('Booking failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [company, booking]);

    const handleNewBooking = useCallback(() => {
        setSubmittedContact(null);
        booking.reset();
        // Reload to clear URL params
        window.location.href = window.location.pathname;
    }, [booking]);

    // Helper to get subtitle for each step
    const getStepSubtitle = (stepId: StepId): string => {
        switch (stepId) {
            case 'location':
                if (booking.selectedLocation) return booking.selectedLocation.name;
                return `${booking.filteredLocations.length} location${booking.filteredLocations.length !== 1 ? 's' : ''} available`;
            case 'service':
                if (booking.selectedService) return booking.selectedService.title;
                return `${booking.filteredServices.length} service${booking.filteredServices.length !== 1 ? 's' : ''} available`;
            case 'specialist':
                if (booking.selectedSpecialist) return booking.selectedSpecialist.fullName;
                return `${booking.filteredSpecialists.length} specialist${booking.filteredSpecialists.length !== 1 ? 's' : ''} available`;
            case 'datetime':
                if (booking.date && booking.time) {
                    return `${booking.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${booking.time}`;
                }
                return 'Select date and time';
            case 'contact':
                return 'Enter your details';
            default:
                return '';
        }
    };

    // Loading state
    if (isLoading || !booking.isInitialized) {
        return (
            <Box style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Branding Side - Hidden on mobile */}
                <Box
                    visibleFrom="md"
                    style={{ flex: 1 }}
                >
                    <BrandingSection companyName="Loading..." />
                </Box>

                {/* Booking Panel */}
                <Box
                    style={{
                        width: '100%',
                        maxWidth: 520,
                        padding: 'var(--mantine-spacing-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CardGridSkeleton count={3} />
                </Box>
            </Box>
        );
    }

    // Error state
    if (error || !company) {
        return (
            <Box style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error" maw={400}>
                    {error?.message || 'Company not found'}
                </Alert>
            </Box>
        );
    }

    // Invalid URL combination
    if (!booking.isValid) {
        return (
            <Box style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Branding Side */}
                <Box visibleFrom="md" style={{ flex: 1 }}>
                    <BrandingSection companyName={company.name} />
                </Box>

                {/* Error Panel */}
                <Box
                    style={{
                        width: '100%',
                        maxWidth: 520,
                        padding: 'var(--mantine-spacing-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        color="red"
                        title="Invalid Booking Link"
                        maw={400}
                    >
                        <Stack gap="sm">
                            <Text size="sm">{booking.validationError}</Text>
                            <Text size="sm" c="dimmed">
                                Please check the link or start a new booking.
                            </Text>
                        </Stack>
                    </Alert>
                </Box>
            </Box>
        );
    }

    // Success state
    if (booking.isComplete && submittedContact && booking.selectedService && booking.selectedSpecialist && booking.date && booking.time) {
        return (
            <Box style={{ display: 'flex', minHeight: '100vh' }}>
                {/* Branding Side */}
                <Box visibleFrom="md" style={{ flex: 1 }}>
                    <BrandingSection companyName={company.name} />
                </Box>

                {/* Success Panel */}
                <Box
                    style={{
                        width: '100%',
                        maxWidth: 520,
                        padding: 'var(--mantine-spacing-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <SuccessCard
                        location={booking.selectedLocation}
                        service={booking.selectedService}
                        specialist={booking.selectedSpecialist}
                        date={booking.date}
                        time={booking.time}
                        contact={submittedContact}
                        onNewBooking={handleNewBooking}
                    />
                </Box>
            </Box>
        );
    }

    // Main booking flow with accordion
    return (
        <Box style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Branding Side - Hidden on mobile */}
            <Box
                visibleFrom="md"
                style={{ flex: 1 }}
            >
                <BrandingSection companyName={company.name} />
            </Box>

            {/* Booking Panel */}
            <Box
                style={{
                    width: '100%',
                    maxWidth: 520,
                    backgroundColor: 'var(--mantine-color-light)',
                    borderLeft: '1px solid var(--mantine-color-gray-2)',
                }}
            >
                <ScrollArea h="100vh">
                    <Stack gap="lg" p="xl">
                        {/* Header */}
                        <Stack gap={4}>
                            <Text size="sm" c="dimmed" tt="uppercase" fw={500}>
                                Book Appointment
                            </Text>
                            <Title order={2} fw={700}>
                                {company.name}
                            </Title>
                        </Stack>

                        {/* Summary of locked items (from URL params) */}
                        {(booking.lockedLocation || booking.lockedService || booking.lockedSpecialist) && (
                            <Paper p="md" radius="md" withBorder bg="gray.0">
                                <BookingSummary
                                    location={booking.lockedLocation ? booking.selectedLocation : null}
                                    service={booking.lockedService ? booking.selectedService : null}
                                    specialist={booking.lockedSpecialist ? booking.selectedSpecialist : null}
                                    isLocked={{
                                        location: booking.lockedLocation,
                                        service: booking.lockedService,
                                        specialist: booking.lockedSpecialist,
                                    }}
                                />
                            </Paper>
                        )}

                        {/* Accordion Steps */}
                        <Accordion
                            value={booking.currentStep}
                            onChange={handleAccordionChange}
                            variant="separated"
                            radius="md"
                            chevronPosition="right"
                            styles={{
                                item: {
                                    border: '1px solid var(--mantine-color-gray-3)',
                                    backgroundColor: 'white',
                                    '&[data-active]': {
                                        backgroundColor: 'white',
                                        borderColor: 'var(--mantine-color-blue-4)',
                                    },
                                },
                                control: {
                                    padding: 'var(--mantine-spacing-md)',
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-gray-0)',
                                    },
                                },
                                panel: {
                                    padding: 'var(--mantine-spacing-md)',
                                    paddingTop: 0,
                                },
                            }}
                        >
                            {/* Location Step */}
                            {booking.showLocationStep && (
                                <Accordion.Item value="location">
                                    <Accordion.Control disabled={!booking.isStepAccessible('location')}>
                                        <AccordionHeader
                                            stepId="location"
                                            title="Choose Location"
                                            subtitle={getStepSubtitle('location')}
                                            state={booking.stepStatus.location}
                                            disabled={!booking.isStepAccessible('location')}
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <LocationSelector
                                            locations={booking.filteredLocations}
                                            selectedLocationId={booking.locationId}
                                            onSelect={booking.selectLocation}
                                        />
                                    </Accordion.Panel>
                                </Accordion.Item>
                            )}

                            {/* Service Step */}
                            {booking.showServiceStep && (
                                <Accordion.Item value="service">
                                    <Accordion.Control disabled={!booking.isStepAccessible('service')}>
                                        <AccordionHeader
                                            stepId="service"
                                            title="Choose Service"
                                            subtitle={getStepSubtitle('service')}
                                            state={booking.stepStatus.service}
                                            disabled={!booking.isStepAccessible('service')}
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <ServiceSelector
                                            services={booking.filteredServices}
                                            selectedServiceId={booking.serviceId}
                                            onSelect={booking.selectService}
                                        />
                                    </Accordion.Panel>
                                </Accordion.Item>
                            )}

                            {/* Specialist Step */}
                            {booking.showSpecialistStep && (
                                <Accordion.Item value="specialist">
                                    <Accordion.Control disabled={!booking.isStepAccessible('specialist')}>
                                        <AccordionHeader
                                            stepId="specialist"
                                            title="Choose Specialist"
                                            subtitle={getStepSubtitle('specialist')}
                                            state={booking.stepStatus.specialist}
                                            disabled={!booking.isStepAccessible('specialist')}
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <SpecialistSelector
                                            specialists={booking.filteredSpecialists}
                                            selectedSpecialistId={booking.specialistId}
                                            onSelect={booking.selectSpecialist}
                                        />
                                    </Accordion.Panel>
                                </Accordion.Item>
                            )}

                            {/* Date & Time Step */}
                            <Accordion.Item value="datetime">
                                <Accordion.Control disabled={!booking.isStepAccessible('datetime')}>
                                    <AccordionHeader
                                        stepId="datetime"
                                        title="Choose Date & Time"
                                        subtitle={getStepSubtitle('datetime')}
                                        state={booking.stepStatus.datetime}
                                        disabled={!booking.isStepAccessible('datetime')}
                                    />
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {booking.selectedSpecialist && booking.selectedService && (
                                        <DateTimeStep
                                            specialist={booking.selectedSpecialist}
                                            serviceDuration={booking.selectedService.duration}
                                            selectedDate={booking.date}
                                            selectedTime={booking.time}
                                            onSelectDate={booking.selectDate}
                                            onSelectTime={booking.selectTime}
                                        />
                                    )}
                                </Accordion.Panel>
                            </Accordion.Item>

                            {/* Contact Step */}
                            <Accordion.Item value="contact">
                                <Accordion.Control disabled={!booking.isStepAccessible('contact')}>
                                    <AccordionHeader
                                        stepId="contact"
                                        title="Your Information"
                                        subtitle={getStepSubtitle('contact')}
                                        state={booking.stepStatus.contact}
                                        disabled={!booking.isStepAccessible('contact')}
                                    />
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ContactInfoStep
                                        onSubmit={handleSubmit}
                                        isSubmitting={isSubmitting}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>

                        {/* Spacer at the bottom */}
                        <Box h={40} />
                    </Stack>
                </ScrollArea>
            </Box>
        </Box>
    );
}

export function BookingFlowContainer(props: BookingFlowContainerProps) {
    return (
        <Suspense fallback={
            <Box style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <CardGridSkeleton count={3} />
            </Box>
        }>
            <BookingFlowContent {...props} />
        </Suspense>
    );
}
