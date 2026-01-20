// ============================================================================
// Form Validation Schemas
// ============================================================================

import * as yup from 'yup';

export const contactFormSchema = yup.object({
    fullName: yup
        .string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: yup
        .string()
        .required('Phone number is required')
        .min(7, 'Please enter a valid phone number'),
    comment: yup
        .string()
        .default(''),
});

export type ContactFormValues = yup.InferType<typeof contactFormSchema>;
