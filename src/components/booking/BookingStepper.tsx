// ============================================================================
// Booking Stepper Component - Main booking flow container
// ============================================================================

'use client';

import { Suspense, useState, useCallback } from 'react';
import { Container, Stack, Stepper, Paper, rem, Title, Text, Alert, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconMapPin, IconBriefcase, IconUser, IconCalendar, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useCompanyData, useBookingState } from '@/hooks';
import { getServicesForLocation, getSpecialistsForServiceAndLocation } from '@/utils/filtering';
import { submitBooking } from '@/lib/mock/api';
import { CardGridSkeleton } from '@/components/ui';
import { SelectionBadge } from '@/components/ui';
import { LocationStep } from './LocationStep';
import { ServiceStep } from './ServiceStep';
import { SpecialistStep } from './SpecialistStep';
import { DateTimeStep } from './DateTimeStep';
import { ContactInfoStep } from './ContactInfoStep';
import { SuccessCard } from './SuccessCard';
import type { ContactFormValues } from '@/utils/validation';
import type { BookingPayload, ContactFormData } from '@/types/booking';

interface BookingStepperProps {
    companySlug: string;
}

function BookingStepperContent({ companySlug }: BookingStepperProps) {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const { data: company, isLoading, error } = useCompanyData(companySlug);

    const booking = useBookingState(company);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedContact, setSubmittedContact] = useState<ContactFormData | null>(null);

    // Get filtered options
    const filteredServices = company
        ? getServicesForLocation(company, booking.locationId)
        : [];
    const filteredSpecialists = company
        ? getSpecialistsForServiceAndLocation(company, booking.serviceId, booking.locationId)
        : [];

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
    }, [booking]);

    // Loading state
    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Stack gap="xl">
                    <Title order={2}>Loading...</Title>
                    <CardGridSkeleton count={3} />
                </Stack>
            </Container>
        );
    }

    // Error state
    if (error || !company) {
        return (
            <Container size="lg" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
                    {error?.message || 'Company not found'}
                </Alert>
            </Container>
        );
    }

    // Success state
    if (booking.isComplete && submittedContact && booking.selectedService && booking.selectedSpecialist && booking.date && booking.time) {
        return (
            <Container size="lg" py="xl">
                <SuccessCard
                    location={booking.selectedLocation}
                    service={booking.selectedService}
                    specialist={booking.selectedSpecialist}
                    date={booking.date}
                    time={booking.time}
                    contact={submittedContact}
                    onNewBooking={handleNewBooking}
                />
            </Container>
        );
    }

    // Calculate which step allows navigation
    const canGoToStep = (step: number) => {
        switch (step) {
            case 0: return true; // Always can go to location
            case 1: return !!booking.locationId; // Need location for service
            case 2: return !!booking.locationId && !!booking.serviceId; // Need service for specialist
            case 3: return !!booking.locationId && !!booking.serviceId && !!booking.specialistId; // Need specialist for date
            case 4: return !!booking.date && !!booking.time; // Need date/time for contact
            default: return false;
        }
    };

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                {/* Header */}
                <Stack gap="xs">
                    <Title order={2}>{company.name}</Title>
                    <Text c="dimmed">Book your appointment</Text>
                </Stack>

                {/* Selection summary */}
                {booking.step > 0 && (
                    <SelectionBadge
                        location={booking.selectedLocation}
                        service={booking.selectedService}
                        specialist={booking.selectedSpecialist}
                        date={booking.date}
                        time={booking.time}
                        compact
                    />
                )}

                {/* Stepper */}
                <Stepper
                    active={booking.step}
                    onStepClick={(step) => canGoToStep(step) && booking.goToStep(step)}
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                    size="sm"
                    styles={{
                        stepBody: { display: isMobile ? undefined : 'none' },
                        step: { padding: rem(8) },
                        stepIcon: { borderWidth: 2 },
                        separator: { marginLeft: isMobile ? undefined : rem(-4), marginRight: isMobile ? undefined : rem(-4) },
                    }}
                >
                    <Stepper.Step
                        label="Location"
                        icon={<IconMapPin size={18} />}
                        completedIcon={<IconCheck size={18} />}
                        allowStepSelect={canGoToStep(0)}
                    >
                        <Paper p="lg" mt="md" withBorder={isMobile} radius="md">
                            <LocationStep
                                locations={company.locations}
                                selectedLocationId={booking.locationId}
                                onSelect={booking.selectLocation}
                            />
                        </Paper>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Service"
                        icon={<IconBriefcase size={18} />}
                        completedIcon={<IconCheck size={18} />}
                        allowStepSelect={canGoToStep(1)}
                    >
                        <Paper p="lg" mt="md" withBorder={isMobile} radius="md">
                            <ServiceStep
                                services={filteredServices}
                                selectedServiceId={booking.serviceId}
                                onSelect={booking.selectService}
                            />
                        </Paper>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Specialist"
                        icon={<IconUser size={18} />}
                        completedIcon={<IconCheck size={18} />}
                        allowStepSelect={canGoToStep(2)}
                    >
                        <Paper p="lg" mt="md" withBorder={isMobile} radius="md">
                            <SpecialistStep
                                specialists={filteredSpecialists}
                                selectedSpecialistId={booking.specialistId}
                                onSelect={booking.selectSpecialist}
                            />
                        </Paper>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Date & Time"
                        icon={<IconCalendar size={18} />}
                        completedIcon={<IconCheck size={18} />}
                        allowStepSelect={canGoToStep(3)}
                    >
                        <Paper p="lg" mt="md" withBorder={isMobile} radius="md">
                            <DateTimeStep
                                specialist={booking.selectedSpecialist}
                                serviceDuration={booking.selectedService?.duration || 60}
                                selectedDate={booking.date}
                                selectedTime={booking.time}
                                onSelectDate={booking.selectDate}
                                onSelectTime={booking.selectTime}
                            />
                        </Paper>
                    </Stepper.Step>

                    <Stepper.Completed>
                        <Paper p="lg" mt="md" withBorder={isMobile} radius="md">
                            <Stack gap="lg">
                                {/* Final summary before submission */}
                                <SelectionBadge
                                    location={booking.selectedLocation}
                                    service={booking.selectedService}
                                    specialist={booking.selectedSpecialist}
                                    date={booking.date}
                                    time={booking.time}
                                />
                                <ContactInfoStep
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            </Stack>
                        </Paper>
                    </Stepper.Completed>
                </Stepper>
            </Stack>
        </Container>
    );
}

export function BookingStepper(props: BookingStepperProps) {
    return (
        <Suspense fallback={
            <Container size="lg" py="xl">
                <CardGridSkeleton count={3} />
            </Container>
        }>
            <BookingStepperContent {...props} />
        </Suspense>
    );
}
