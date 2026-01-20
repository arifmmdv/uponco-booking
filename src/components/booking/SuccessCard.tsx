// ============================================================================
// Success Card Component
// ============================================================================

'use client';

import { Card, Stack, Text, Group, Badge, Divider, Button, ThemeIcon } from '@mantine/core';
import { IconCheck, IconMapPin, IconBriefcase, IconUser, IconCalendar, IconClock, IconMail, IconPhone } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { ParsedLocation, ParsedService, ParsedSpecialist, ContactFormData } from '@/types/booking';

interface SuccessCardProps {
    location: ParsedLocation | null;
    service: ParsedService;
    specialist: ParsedSpecialist;
    date: Date;
    time: string;
    contact: ContactFormData;
    onNewBooking?: () => void;
}

export function SuccessCard({
    location,
    service,
    specialist,
    date,
    time,
    contact,
    onNewBooking,
}: SuccessCardProps) {
    return (
        <Card withBorder padding="xl" radius="lg" shadow="md" maw={500} mx="auto">
            <Stack gap="lg" align="center">
                {/* Success Icon */}
                <ThemeIcon size={64} radius="xl" color="green" variant="light">
                    <IconCheck size={36} />
                </ThemeIcon>

                <Stack gap={4} align="center">
                    <Text size="xl" fw={700}>Booking Confirmed!</Text>
                    <Text size="sm" c="dimmed">We&apos;ve sent a confirmation to your email</Text>
                </Stack>

                <Divider w="100%" />

                {/* Booking Details */}
                <Stack gap="sm" w="100%">
                    <Text size="sm" fw={600} c="dimmed" tt="uppercase">Booking Details</Text>

                    <Group gap="sm">
                        <IconBriefcase size={18} style={{ color: 'var(--mantine-color-green-6)' }} />
                        <Text size="sm">{service.title}</Text>
                        <Badge size="sm" variant="light" color="gray">
                            {service.duration} min • ${service.priceMin}{service.priceMin !== service.priceMax && ` - $${service.priceMax}`}
                        </Badge>
                    </Group>

                    <Group gap="sm">
                        <IconUser size={18} style={{ color: 'var(--mantine-color-violet-6)' }} />
                        <Text size="sm">{specialist.fullName}</Text>
                    </Group>

                    {location && (
                        <Group gap="sm">
                            <IconMapPin size={18} style={{ color: 'var(--mantine-color-blue-6)' }} />
                            <Text size="sm">
                                {location.locationType === 'online' ? 'Virtual Meeting' : location.name}
                            </Text>
                        </Group>
                    )}

                    <Group gap="sm">
                        <IconCalendar size={18} style={{ color: 'var(--mantine-color-orange-6)' }} />
                        <Text size="sm">{dayjs(date).format('dddd, MMMM D, YYYY')}</Text>
                    </Group>

                    <Group gap="sm">
                        <IconClock size={18} style={{ color: 'var(--mantine-color-cyan-6)' }} />
                        <Text size="sm">{time}</Text>
                    </Group>
                </Stack>

                <Divider w="100%" />

                {/* Contact Info */}
                <Stack gap="sm" w="100%">
                    <Text size="sm" fw={600} c="dimmed" tt="uppercase">Your Information</Text>

                    <Group gap="sm">
                        <IconUser size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm">{contact.fullName}</Text>
                    </Group>

                    <Group gap="sm">
                        <IconMail size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm">{contact.email}</Text>
                    </Group>

                    <Group gap="sm">
                        <IconPhone size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
                        <Text size="sm">{contact.phone}</Text>
                    </Group>

                    {contact.comment && (
                        <Text size="sm" c="dimmed" fs="italic">
                            Note: {contact.comment}
                        </Text>
                    )}
                </Stack>

                {onNewBooking && (
                    <>
                        <Divider w="100%" />
                        <Button variant="light" onClick={onNewBooking} fullWidth>
                            Book Another Appointment
                        </Button>
                    </>
                )}
            </Stack>
        </Card>
    );
}
