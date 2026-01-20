// ============================================================================
// Branding Section Component
// Left-side branding panel for desktop layout
// ============================================================================

'use client';

import { Box, Stack, Text, Title } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';

interface BrandingSectionProps {
    companyName: string;
}

export function BrandingSection({ companyName }: BrandingSectionProps) {
    return (
        <Box
            style={{
                height: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-violet-9) 50%, var(--mantine-color-grape-8) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'var(--mantine-spacing-xl)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decorations */}
            <Box
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    filter: 'blur(40px)',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '5%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Content */}
            <Stack gap="xl" align="center" style={{ zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
                {/* Logo/Icon */}
                <Box
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <IconSparkles size={40} color="white" />
                </Box>

                {/* Company Name */}
                <Title
                    order={1}
                    c="white"
                    style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                    }}
                >
                    {companyName}
                </Title>

                {/* Tagline */}
                <Text
                    size="lg"
                    c="white"
                    style={{ opacity: 0.8 }}
                >
                    Book your perfect appointment in just a few clicks
                </Text>

                {/* Features */}
                <Stack gap="xs" mt="lg">
                    {[
                        'Choose your preferred specialist',
                        'Select from available time slots',
                        'Instant booking confirmation',
                    ].map((feature, index) => (
                        <Text
                            key={index}
                            size="sm"
                            c="white"
                            style={{
                                opacity: 0.7,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <Box
                                component="span"
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'white',
                                    opacity: 0.6,
                                }}
                            />
                            {feature}
                        </Text>
                    ))}
                </Stack>
            </Stack>

            {/* Bottom decoration */}
            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                }}
            />
        </Box>
    );
}
