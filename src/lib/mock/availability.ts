// ============================================================================
// Availability Generator
// Generates available time slots based on work hours and service duration
// ============================================================================

import dayjs from 'dayjs';
import type { TimeSlot, ParsedSpecialist } from '@/types/booking';

// ============================================================================
// Types
// ============================================================================

interface AvailabilityParams {
    specialist: ParsedSpecialist;
    date: Date;
    serviceDuration: number; // in minutes
}

// ============================================================================
// Helper Functions
// ============================================================================

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function isWithinBreak(
    slotStart: number,
    slotEnd: number,
    breaks: { startTime: string; endTime: string }[]
): boolean {
    for (const breakPeriod of breaks) {
        const breakStart = timeToMinutes(breakPeriod.startTime);
        const breakEnd = timeToMinutes(breakPeriod.endTime);

        // Check if slot overlaps with break
        if (slotStart < breakEnd && slotEnd > breakStart) {
            return true;
        }
    }
    return false;
}

// Simulate some random unavailability for existing appointments
function hasExistingAppointment(
    specialistId: string,
    date: Date,
    time: string
): boolean {
    // Use a deterministic "random" based on specialist ID, date, and time
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const seed = `${specialistId}-${dateStr}-${time}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // ~20% chance of being booked
    return Math.abs(hash % 100) < 20;
}

// ============================================================================
// Main Function
// ============================================================================

export function getAvailableSlots(params: AvailabilityParams): TimeSlot[] {
    const { specialist, date, serviceDuration } = params;
    const slots: TimeSlot[] = [];

    const dayOfWeek = dayjs(date).day(); // 0-6 (Sunday-Saturday)
    const today = dayjs().startOf('day');
    const targetDate = dayjs(date).startOf('day');

    // Don't show slots for past dates
    if (targetDate.isBefore(today)) {
        return [];
    }

    // Don't show slots more than 30 days in the future
    if (targetDate.diff(today, 'day') > 30) {
        return [];
    }

    // Find work hours for this day
    const workDay = specialist.workSchedule.find(wd => wd.dayOfWeek === dayOfWeek);

    if (!workDay) {
        return []; // Specialist doesn't work on this day
    }

    const startMinutes = timeToMinutes(workDay.startTime);
    const endMinutes = timeToMinutes(workDay.endTime);

    // Generate slots based on service duration
    const slotInterval = serviceDuration; // Use service duration as interval

    for (let current = startMinutes; current + serviceDuration <= endMinutes; current += slotInterval) {
        const slotStart = current;
        const slotEnd = current + serviceDuration;
        const timeStr = minutesToTime(current);

        // Check if slot overlaps with breaks
        if (isWithinBreak(slotStart, slotEnd, workDay.breaks)) {
            continue;
        }

        // Check for existing appointments (mock)
        const isBooked = hasExistingAppointment(specialist.id, date, timeStr);

        // If today, filter out past time slots
        if (targetDate.isSame(today, 'day')) {
            const now = dayjs();
            const slotDateTime = dayjs(date)
                .hour(Math.floor(current / 60))
                .minute(current % 60);

            if (slotDateTime.isBefore(now)) {
                continue;
            }
        }

        slots.push({
            time: timeStr,
            available: !isBooked,
        });
    }

    return slots;
}

// ============================================================================
// Get availability for next N days
// ============================================================================

export function getAvailabilityForDays(
    specialist: ParsedSpecialist,
    serviceDuration: number,
    days: number = 7
): Map<string, TimeSlot[]> {
    const availability = new Map<string, TimeSlot[]>();
    const today = dayjs();

    for (let i = 0; i < days; i++) {
        const date = today.add(i, 'day').toDate();
        const dateStr = dayjs(date).format('YYYY-MM-DD');
        const slots = getAvailableSlots({ specialist, date, serviceDuration });
        availability.set(dateStr, slots);
    }

    return availability;
}
