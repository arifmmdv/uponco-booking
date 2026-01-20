// ============================================================================
// Contact Info Step Component
// ============================================================================

'use client';

import { Stack, Text, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconUser, IconMail, IconPhone, IconMessage } from '@tabler/icons-react';
import { contactFormSchema, type ContactFormValues } from '@/utils/validation';

interface ContactInfoStepProps {
    onSubmit: (values: ContactFormValues) => void;
    isSubmitting?: boolean;
}

export function ContactInfoStep({
    onSubmit,
    isSubmitting = false,
}: ContactInfoStepProps) {
    const form = useForm<ContactFormValues>({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            comment: '',
        },
        validate: yupResolver(contactFormSchema),
    });

    return (
        <Stack gap="lg">
            <Text size="lg" fw={500}>
                Your contact information
            </Text>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap="md" maw={500}>
                    <TextInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        leftSection={<IconUser size={16} />}
                        required
                        {...form.getInputProps('fullName')}
                    />

                    <TextInput
                        label="Email"
                        placeholder="Enter your email address"
                        leftSection={<IconMail size={16} />}
                        required
                        {...form.getInputProps('email')}
                    />

                    <TextInput
                        label="Phone"
                        placeholder="Enter your phone number"
                        leftSection={<IconPhone size={16} />}
                        required
                        {...form.getInputProps('phone')}
                    />

                    <Textarea
                        label="Comment (optional)"
                        placeholder="Any special requests or notes..."
                        leftSection={<IconMessage size={16} />}
                        minRows={3}
                        {...form.getInputProps('comment')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button
                            type="submit"
                            size="lg"
                            loading={isSubmitting}
                        >
                            Confirm Booking
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Stack>
    );
}
