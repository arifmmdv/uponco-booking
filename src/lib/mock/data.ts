// ============================================================================
// Mock Data - Real API Response Structure
// ============================================================================

import type { SupabaseCompanyResponse } from '@/types/database';

// Company ID - matches real API
const COMPANY_ID = '8d25b74b-eaf7-40b9-bf31-0353cf11d9ac';

// ============================================================================
// Mock Supabase Response - Matching Real API Structure
// ============================================================================

export const mockCompanyData: SupabaseCompanyResponse = {
    id: COMPANY_ID,
    name: 'Uponco',
    locations: [
        {
            id: 'bb2fa96a-068c-4b81-b56d-2ce5e8576a03',
            name: 'Riga',
            profile_locations: [
                { profileId: '600c4f06-9721-426a-8a4d-8cc9e90ec4dd' },
            ],
        },
        {
            id: '977f7566-b4cd-47ca-9171-9b13cd9dc57a',
            name: 'Ganjlik',
            profile_locations: [
                { profileId: '28eb80fa-345f-4236-a3e5-62835b8b6a7e' },
            ],
        },
        {
            id: 'c914d61f-7886-4a85-a6cd-c80879cc8eee',
            name: 'Xalglar',
            profile_locations: [
                { profileId: '999d81cc-632f-4dbb-aba2-890aa84d33b5' },
            ],
        },
        {
            id: '5aab5c70-9c11-4fbb-b27b-141a6e1bc1ae',
            name: 'Toulusse',
            profile_locations: [
                { profileId: 'f29a1e83-d53d-4a58-b37c-ab9a47cccc69' },
            ],
        },
        {
            id: '494713a3-7ecc-4da9-a556-5b4a63442fd9',
            name: 'Jelgava',
            profile_locations: [
                { profileId: '999d81cc-632f-4dbb-aba2-890aa84d33b5' },
                { profileId: 'f29a1e83-d53d-4a58-b37c-ab9a47cccc69' },
            ],
        },
    ],
    services: [
        {
            id: 'b9d8d9d2-f98c-42aa-8b1c-d08c640fc679',
            title: 'Law Consultation',
            capacity: 1,
            duration: 30,
            priceMax: 200,
            priceMin: 200,
            description: 'Here we go',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: '5aab5c70-9c11-4fbb-b27b-141a6e1bc1ae' },
                { locationId: '494713a3-7ecc-4da9-a556-5b4a63442fd9' },
            ],
            service_categories: {
                id: '97384077-37c6-4356-94f3-2f66abdf0d91',
                title: 'Law & Regulations',
            },
            service_assignments: [
                { profileId: 'f29a1e83-d53d-4a58-b37c-ab9a47cccc69' },
            ],
        },
        {
            id: '8bb21c9d-48e2-4374-94a5-cdf76bbbae36',
            title: 'Interior Design',
            capacity: 1,
            duration: 45,
            priceMax: 150,
            priceMin: 150,
            description: '',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: 'c914d61f-7886-4a85-a6cd-c80879cc8eee' },
                { locationId: '494713a3-7ecc-4da9-a556-5b4a63442fd9' },
            ],
            service_categories: {
                id: '6af0c196-b835-4f32-8ff2-0e8006277b42',
                title: 'Architecture',
            },
            service_assignments: [
                { profileId: '999d81cc-632f-4dbb-aba2-890aa84d33b5' },
            ],
        },
        {
            id: '53c35617-40de-4feb-9c21-9e4daac3ca4f',
            title: 'Exterior Design',
            capacity: 1,
            duration: 30,
            priceMax: 300,
            priceMin: 300,
            description: '',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: 'c914d61f-7886-4a85-a6cd-c80879cc8eee' },
            ],
            service_categories: {
                id: '6af0c196-b835-4f32-8ff2-0e8006277b42',
                title: 'Architecture',
            },
            service_assignments: [
                { profileId: '999d81cc-632f-4dbb-aba2-890aa84d33b5' },
            ],
        },
        {
            id: '7f454579-b002-42ee-8ed1-71d11ced30b8',
            title: 'Web Development',
            capacity: 1,
            duration: 30,
            priceMax: 50,
            priceMin: 50,
            description: '',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: 'bb2fa96a-068c-4b81-b56d-2ce5e8576a03' },
            ],
            service_categories: {
                id: '83ad8106-57e4-41c8-92ad-a0b74bba2374',
                title: 'Information Technology',
            },
            service_assignments: [
                { profileId: '600c4f06-9721-426a-8a4d-8cc9e90ec4dd' },
            ],
        },
        {
            id: 'f270068c-2cc4-49a7-bc8e-6342de81cd67',
            title: 'Mobile App',
            capacity: 1,
            duration: 60,
            priceMax: 200,
            priceMin: 200,
            description: 'Share your ideas and get your pricing.',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: 'bb2fa96a-068c-4b81-b56d-2ce5e8576a03' },
            ],
            service_categories: {
                id: '83ad8106-57e4-41c8-92ad-a0b74bba2374',
                title: 'Information Technology',
            },
            service_assignments: [
                { profileId: '600c4f06-9721-426a-8a4d-8cc9e90ec4dd' },
            ],
        },
        {
            id: 'c30f680b-03bf-4275-8f76-e1b629b2cf6b',
            title: 'Health Check',
            capacity: 1,
            duration: 30,
            priceMax: 1000,
            priceMin: 1000,
            description: 'Get general recommendation about your health.',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: '977f7566-b4cd-47ca-9171-9b13cd9dc57a' },
            ],
            service_categories: {
                id: '28ff5023-d8f0-44bd-a563-3c8d29792cd3',
                title: 'Healthcare',
            },
            service_assignments: [
                { profileId: '28eb80fa-345f-4236-a3e5-62835b8b6a7e' },
            ],
        },
        {
            id: '42e8ccf0-0b9a-42c0-864e-f67c1ff32a82',
            title: 'Educational lecture',
            capacity: 4,
            duration: 90,
            priceMax: 800,
            priceMin: 800,
            description: 'You will get general information on lecture.',
            serviceType: 'Group Event',
            technicalBreak: 10,
            service_locations: [
                { locationId: '977f7566-b4cd-47ca-9171-9b13cd9dc57a' },
            ],
            service_categories: {
                id: '28ff5023-d8f0-44bd-a563-3c8d29792cd3',
                title: 'Healthcare',
            },
            service_assignments: [
                { profileId: '28eb80fa-345f-4236-a3e5-62835b8b6a7e' },
            ],
        },
        {
            id: 'd611ec69-538e-4fa3-9bd6-6bbae1489057',
            title: 'Instant Lawyer',
            capacity: 1,
            duration: 454,
            priceMax: 300,
            priceMin: 300,
            description: '',
            serviceType: 'Appointment',
            technicalBreak: 0,
            service_locations: [
                { locationId: '5aab5c70-9c11-4fbb-b27b-141a6e1bc1ae' },
            ],
            service_categories: {
                id: '97384077-37c6-4356-94f3-2f66abdf0d91',
                title: 'Law & Regulations',
            },
            service_assignments: [
                { profileId: 'f29a1e83-d53d-4a58-b37c-ab9a47cccc69' },
            ],
        },
    ],
    role_user: [
        {
            profiles: {
                id: 'f29a1e83-d53d-4a58-b37c-ab9a47cccc69',
                email: 'test2@gmail.com',
                fullName: 'Aytan Mammadova',
                users_work_hours: [
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 1,
                        startTime: '09:00:00',
                        users_work_breaks: [
                            { endTime: '13:00:00', startTime: '12:00:00', workHourId: 'wh-aytan-1' },
                        ],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 2,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 3,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 4,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 5,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                ],
            },
        },
        {
            profiles: {
                id: '999d81cc-632f-4dbb-aba2-890aa84d33b5',
                email: 'test1@gmail.com',
                fullName: 'Azar Mammadov',
                users_work_hours: [
                    {
                        endTime: '17:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 1,
                        startTime: '10:00:00',
                        users_work_breaks: [
                            { endTime: '14:00:00', startTime: '13:00:00', workHourId: 'wh-azar-1' },
                        ],
                    },
                    {
                        endTime: '17:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 2,
                        startTime: '10:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '17:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 3,
                        startTime: '10:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '17:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 4,
                        startTime: '10:00:00',
                        users_work_breaks: [],
                    },
                ],
            },
        },
        {
            profiles: {
                id: '28eb80fa-345f-4236-a3e5-62835b8b6a7e',
                email: 'sevinc.mammadova.2000@gmail.com',
                fullName: 'Sevinc Mammadova',
                users_work_hours: [
                    {
                        endTime: '16:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 1,
                        startTime: '08:00:00',
                        users_work_breaks: [
                            { endTime: '12:30:00', startTime: '12:00:00', workHourId: 'wh-sevinc-1' },
                        ],
                    },
                    {
                        endTime: '16:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 2,
                        startTime: '08:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '16:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 3,
                        startTime: '08:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '16:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 4,
                        startTime: '08:00:00',
                        users_work_breaks: [],
                    },
                ],
            },
        },
        {
            profiles: {
                id: '600c4f06-9721-426a-8a4d-8cc9e90ec4dd',
                email: 'arif.mmdv@gmail.com',
                fullName: 'Arif Mammadov',
                users_work_hours: [
                    {
                        endTime: '20:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 1,
                        startTime: '09:00:00',
                        users_work_breaks: [
                            { endTime: '14:00:00', startTime: '13:00:00', workHourId: 'wh-arif-1' },
                        ],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 2,
                        startTime: '09:00:00',
                        users_work_breaks: [
                            { endTime: '13:00:00', startTime: '12:00:00', workHourId: 'wh-arif-2' },
                            { endTime: '16:00:00', startTime: '15:00:00', workHourId: 'wh-arif-3' },
                        ],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 3,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '18:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 4,
                        startTime: '09:00:00',
                        users_work_breaks: [],
                    },
                    {
                        endTime: '17:00:00',
                        companyId: COMPANY_ID,
                        dayOfWeek: 5,
                        startTime: '09:00:00',
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
    'bb2fa96a-068c-4b81-b56d-2ce5e8576a03': {
        address: 'Brivibas iela 123',
        city: 'Riga',
        countryRegion: 'Latvia',
        postalCode: 'LV-1010',
        phone: '+371 67 123 456',
        locationType: 'physical',
    },
    '977f7566-b4cd-47ca-9171-9b13cd9dc57a': {
        address: 'Ganjlik Mall, Floor 3',
        city: 'Baku',
        countryRegion: 'Azerbaijan',
        postalCode: 'AZ1000',
        phone: '+994 12 345 6789',
        locationType: 'physical',
    },
    'c914d61f-7886-4a85-a6cd-c80879cc8eee': {
        address: 'Xalglar District, Building 45',
        city: 'Baku',
        countryRegion: 'Azerbaijan',
        postalCode: 'AZ1100',
        phone: '+994 12 987 6543',
        locationType: 'physical',
    },
    '5aab5c70-9c11-4fbb-b27b-141a6e1bc1ae': {
        address: '15 Rue du Taur',
        city: 'Toulouse',
        countryRegion: 'France',
        postalCode: '31000',
        phone: '+33 5 61 12 34 56',
        locationType: 'physical',
    },
    '494713a3-7ecc-4da9-a556-5b4a63442fd9': {
        address: 'Liela iela 78',
        city: 'Jelgava',
        countryRegion: 'Latvia',
        postalCode: 'LV-3001',
        phone: '+371 63 012 345',
        locationType: 'physical',
    },
};
