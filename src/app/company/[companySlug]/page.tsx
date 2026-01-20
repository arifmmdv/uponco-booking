// ============================================================================
// Company Booking Page
// ============================================================================

import { BookingStepper } from '@/components/booking';

interface PageProps {
    params: Promise<{
        companySlug: string;
    }>;
}

export default async function CompanyBookingPage({ params }: PageProps) {
    const { companySlug } = await params;

    return <BookingStepper companySlug={companySlug} />;
}

export async function generateMetadata({ params }: PageProps) {
    const { companySlug } = await params;

    return {
        title: `Book Appointment | ${companySlug}`,
        description: `Book your appointment with ${companySlug}`,
    };
}
