// ============================================================================
// Mock Data - Relational data with edge cases for testing
// ============================================================================

import type { SupabaseCompanyResponse } from '@/types/database';

// Company ID
const COMPANY_ID = 'company-uponco-001';

// ============================================================================
// Mock Supabase Response
// ============================================================================

export const mockCompanyData: SupabaseCompanyResponse = {
    id: COMPANY_ID,
    name: 'Uponco Wellness & Beauty',
    locations: [
        {
            id: 'loc-downtown',
            name: 'Downtown Wellness Center',
            profile_locations: [
                { profileId: 'spec-alice' },
                { profileId: 'spec-bob' },
                { profileId: 'spec-carol' },
            ],
        },
        {
            id: 'loc-uptown',
            name: 'Uptown Beauty Spa',
            profile_locations: [
                { profileId: 'spec-bob' },
                { profileId: 'spec-diana' },
            ],
        },
        {
            id: 'loc-online',
            name: 'Virtual Consultations',
            profile_locations: [
                { profileId: 'spec-alice' },
                { profileId: 'spec-carol' },
            ],
        },
    ],
    services: [
        {
            id: 'svc-massage',
            title: 'Deep Tissue Massage',
            priceMin: 80,
            priceMax: 120,
            duration: 60,
            technicalBreak: 10,
            serviceType: 'individual',
            capacity: 1,
            description: 'Therapeutic deep tissue massage targeting muscle tension and chronic pain relief.',
            service_categories: { id: 'cat-wellness', title: 'Wellness' },
            service_locations: [
                { locationId: 'loc-downtown' },
                { locationId: 'loc-uptown' },
            ],
            service_assignments: [
                { profileId: 'spec-alice' },
                { profileId: 'spec-bob' },
            ],
        },
        {
            id: 'svc-facial',
            title: 'Luxury Facial Treatment',
            priceMin: 100,
            priceMax: 150,
            duration: 75,
            technicalBreak: 15,
            serviceType: 'individual',
            capacity: 1,
            description: 'Premium facial treatment with deep cleansing, exfoliation, and hydrating mask.',
            service_categories: { id: 'cat-beauty', title: 'Beauty' },
            service_locations: [
                { locationId: 'loc-uptown' },
            ],
            service_assignments: [
                { profileId: 'spec-diana' },
            ],
        },
        {
            id: 'svc-consultation',
            title: 'Wellness Consultation',
            priceMin: 50,
            priceMax: 50,
            duration: 30,
            technicalBreak: 5,
            serviceType: 'individual',
            capacity: 1,
            description: 'One-on-one wellness consultation to discuss your health goals and create a personalized plan.',
            service_categories: { id: 'cat-wellness', title: 'Wellness' },
            service_locations: [
                { locationId: 'loc-downtown' },
                { locationId: 'loc-online' },
            ],
            service_assignments: [
                { profileId: 'spec-alice' },
                { profileId: 'spec-carol' },
            ],
        },
        {
            id: 'svc-yoga',
            title: 'Private Yoga Session',
            priceMin: 70,
            priceMax: 90,
            duration: 60,
            technicalBreak: 10,
            serviceType: 'individual',
            capacity: 1,
            description: 'Personalized yoga session tailored to your experience level and goals.',
            service_categories: { id: 'cat-wellness', title: 'Wellness' },
            service_locations: [
                { locationId: 'loc-downtown' },
            ],
            service_assignments: [
                { profileId: 'spec-carol' },
            ],
        },
        {
            id: 'svc-haircut',
            title: 'Premium Haircut & Styling',
            priceMin: 60,
            priceMax: 100,
            duration: 45,
            technicalBreak: 10,
            serviceType: 'individual',
            capacity: 1,
            description: 'Expert haircut and styling service with consultation.',
            service_categories: { id: 'cat-beauty', title: 'Beauty' },
            service_locations: [
                { locationId: 'loc-uptown' },
            ],
            service_assignments: [
                { profileId: 'spec-bob' },
                { profileId: 'spec-diana' },
            ],
        },
    ],
    role_user: [
        {
            profiles: {
                id: 'spec-alice',
                fullName: 'Alice Johnson',
                email: 'alice@uponco.com',
                users_work_hours: [
                    {
                        dayOfWeek: 1, // Monday
                        startTime: '09:00',
                        endTime: '17:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '13:00', workHourId: 'wh-1' },
                        ],
                    },
                    {
                        dayOfWeek: 2, // Tuesday
                        startTime: '09:00',
                        endTime: '17:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '13:00', workHourId: 'wh-2' },
                        ],
                    },
                    {
                        dayOfWeek: 3, // Wednesday
                        startTime: '10:00',
                        endTime: '18:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '13:00', endTime: '14:00', workHourId: 'wh-3' },
                        ],
                    },
                    {
                        dayOfWeek: 4, // Thursday
                        startTime: '09:00',
                        endTime: '17:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '13:00', workHourId: 'wh-4' },
                        ],
                    },
                    {
                        dayOfWeek: 5, // Friday
                        startTime: '09:00',
                        endTime: '15:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [],
                    },
                ],
            },
        },
        {
            profiles: {
                id: 'spec-bob',
                fullName: 'Bob Smith',
                email: 'bob@uponco.com',
                users_work_hours: [
                    {
                        dayOfWeek: 1,
                        startTime: '10:00',
                        endTime: '18:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '13:00', endTime: '14:00', workHourId: 'wh-5' },
                        ],
                    },
                    {
                        dayOfWeek: 2,
                        startTime: '10:00',
                        endTime: '18:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '13:00', endTime: '14:00', workHourId: 'wh-6' },
                        ],
                    },
                    {
                        dayOfWeek: 3,
                        startTime: '10:00',
                        endTime: '18:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '13:00', endTime: '14:00', workHourId: 'wh-7' },
                        ],
                    },
                    {
                        dayOfWeek: 4,
                        startTime: '10:00',
                        endTime: '18:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '13:00', endTime: '14:00', workHourId: 'wh-8' },
                        ],
                    },
                    {
                        dayOfWeek: 5,
                        startTime: '10:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [],
                    },
                    {
                        dayOfWeek: 6, // Saturday
                        startTime: '09:00',
                        endTime: '14:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [],
                    },
                ],
            },
        },
        {
            profiles: {
                id: 'spec-carol',
                fullName: 'Carol Davis',
                email: 'carol@uponco.com',
                users_work_hours: [
                    {
                        dayOfWeek: 1,
                        startTime: '08:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '12:30', workHourId: 'wh-9' },
                        ],
                    },
                    {
                        dayOfWeek: 2,
                        startTime: '08:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '12:30', workHourId: 'wh-10' },
                        ],
                    },
                    {
                        dayOfWeek: 3,
                        startTime: '08:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '12:30', workHourId: 'wh-11' },
                        ],
                    },
                    {
                        dayOfWeek: 4,
                        startTime: '08:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '12:00', endTime: '12:30', workHourId: 'wh-12' },
                        ],
                    },
                ],
            },
        },
        {
            profiles: {
                id: 'spec-diana',
                fullName: 'Diana Martinez',
                email: 'diana@uponco.com',
                users_work_hours: [
                    {
                        dayOfWeek: 2,
                        startTime: '11:00',
                        endTime: '19:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '14:00', endTime: '15:00', workHourId: 'wh-13' },
                        ],
                    },
                    {
                        dayOfWeek: 3,
                        startTime: '11:00',
                        endTime: '19:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '14:00', endTime: '15:00', workHourId: 'wh-14' },
                        ],
                    },
                    {
                        dayOfWeek: 4,
                        startTime: '11:00',
                        endTime: '19:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '14:00', endTime: '15:00', workHourId: 'wh-15' },
                        ],
                    },
                    {
                        dayOfWeek: 5,
                        startTime: '11:00',
                        endTime: '19:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [
                            { startTime: '14:00', endTime: '15:00', workHourId: 'wh-16' },
                        ],
                    },
                    {
                        dayOfWeek: 6,
                        startTime: '10:00',
                        endTime: '16:00',
                        companyId: COMPANY_ID,
                        users_work_breaks: [],
                    },
                ],
            },
        },
    ],
};

// ============================================================================
// Extended Location Data (for UI display)
// ============================================================================

export const locationDetails: Record<string, {
    address: string;
    city: string;
    countryRegion: string;
    postalCode: string;
    phone: string;
    locationType: 'physical' | 'online';
}> = {
    'loc-downtown': {
        address: '123 Main Street, Suite 200',
        city: 'New York',
        countryRegion: 'NY',
        postalCode: '10001',
        phone: '+1 (555) 123-4567',
        locationType: 'physical',
    },
    'loc-uptown': {
        address: '456 Park Avenue, Floor 15',
        city: 'New York',
        countryRegion: 'NY',
        postalCode: '10022',
        phone: '+1 (555) 987-6543',
        locationType: 'physical',
    },
    'loc-online': {
        address: '',
        city: '',
        countryRegion: '',
        postalCode: '',
        phone: '+1 (555) 000-0000',
        locationType: 'online',
    },
};
