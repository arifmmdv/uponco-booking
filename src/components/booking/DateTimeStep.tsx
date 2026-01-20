// ============================================================================
// Date Time Step Component
// ============================================================================

'use client';

import { Stack, Text, Group, Paper, Alert, SimpleGrid, Box } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { TimeSlotCard } from '@/components/cards';
import { TimeSlotsSkeleton } from '@/components/ui';
import { useAvailableSlots } from '@/hooks';
import type { ParsedSpecialist } from '@/types/booking';

interface DateTimeStepProps {
    specialist: ParsedSpecialist | null;
    serviceDuration: number;
    selectedDate: Date | null;
    selectedTime: string | null;
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string) => void;
}

// Convert Date to Mantine's DateStringValue (YYYY-MM-DD)
function dateToString(date: Date | null): string | null {
    if (!date) return null;
    return dayjs(date).format('YYYY-MM-DD');
}

// Convert Mantine's DateStringValue to Date
function stringToDate(dateStr: string): Date {
    return dayjs(dateStr).toDate();
}

export function DateTimeStep({
    specialist,
    serviceDuration,
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
}: DateTimeStepProps) {
    const { data: slots, isLoading } = useAvailableSlots({
        specialist,
        date: selectedDate,
        serviceDuration,
    });

    const minDate = dateToString(new Date());
    const maxDate = dateToString(dayjs().add(30, 'day').toDate());

    // Get working days for the specialist
    const workingDays = specialist?.workSchedule.map(w => w.dayOfWeek) || [];

    // Exclude dates where specialist doesn't work (receives date string)
    const excludeDate = (dateStr: string) => {
        const dayOfWeek = dayjs(dateStr).day();
        return !workingDays.includes(dayOfWeek);
    };

    const handleDateChange = (dateStr: string | null) => {
        if (dateStr) {
            onSelectDate(stringToDate(dateStr));
        }
    };

    const availableSlots = slots?.filter(slot => slot.available) || [];
    const unavailableSlots = slots?.filter(slot => !slot.available) || [];

    return (
        <Stack gap="lg">
            <Text size="lg" fw={500}>
                Select date and time
            </Text>

            <Group align="flex-start" gap="xl" wrap="wrap">
                {/* Date Picker */}
                <Paper withBorder p="md" radius="md">
                    <Stack gap="sm">
                        <Text size="sm" fw={500} c="dimmed">Select a date</Text>
                        <DatePicker
                            value={dateToString(selectedDate)}
                            onChange={handleDateChange}
                            minDate={minDate || undefined}
                            maxDate={maxDate || undefined}
                            excludeDate={excludeDate}
                            size="md"
                        />
                    </Stack>
                </Paper>

                {/* Time Slots */}
                <Box style={{ flex: 1, minWidth: 280 }}>
                    <Paper withBorder p="md" radius="md">
                        <Stack gap="sm">
                            <Text size="sm" fw={500} c="dimmed">
                                {selectedDate
                                    ? `Available times for ${dayjs(selectedDate).format('ddd, MMM D')}`
                                    : 'Select a date to see available times'
                                }
                            </Text>

                            {!selectedDate && (
                                <Text size="sm" c="dimmed">
                                    Please select a date first
                                </Text>
                            )}

                            {selectedDate && isLoading && <TimeSlotsSkeleton />}

                            {selectedDate && !isLoading && slots && slots.length === 0 && (
                                <Alert icon={<IconAlertCircle size={16} />} color="yellow">
                                    No available time slots for this date.
                                </Alert>
                            )}

                            {selectedDate && !isLoading && availableSlots.length > 0 && (
                                <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="xs">
                                    {availableSlots.map((slot) => (
                                        <TimeSlotCard
                                            key={slot.time}
                                            slot={slot}
                                            selected={selectedTime === slot.time}
                                            onClick={() => onSelectTime(slot.time)}
                                        />
                                    ))}
                                </SimpleGrid>
                            )}

                            {selectedDate && !isLoading && unavailableSlots.length > 0 && (
                                <Stack gap="xs" mt="md">
                                    <Text size="xs" c="dimmed">Already booked:</Text>
                                    <SimpleGrid cols={{ base: 3, sm: 4, md: 5 }} spacing="xs">
                                        {unavailableSlots.map((slot) => (
                                            <TimeSlotCard
                                                key={slot.time}
                                                slot={slot}
                                                selected={false}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Stack>
                            )}
                        </Stack>
                    </Paper>
                </Box>
            </Group>
        </Stack>
    );
}
