// ============================================================================
// Mantine Theme Configuration
// ============================================================================

'use client';

import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

// Custom color palette (using Mantine defaults, can be customized later)
const primary: MantineColorsTuple = [
    '#e5f4ff',
    '#cde2ff',
    '#9bc2ff',
    '#64a0ff',
    '#3984fe',
    '#1d72fe',
    '#0969ff',
    '#0058e4',
    '#004ecd',
    '#0043b5'
];

export const theme = createTheme({
    primaryColor: 'blue',
    colors: {
        primary,
    },
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    headings: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '600',
    },
    radius: {
        xs: rem(4),
        sm: rem(6),
        md: rem(8),
        lg: rem(12),
        xl: rem(16),
    },
    spacing: {
        xs: rem(8),
        sm: rem(12),
        md: rem(16),
        lg: rem(24),
        xl: rem(32),
    },
    defaultRadius: 'md',
    components: {
        Card: {
            defaultProps: {
                shadow: 'sm',
                radius: 'md',
                padding: 'lg',
            },
        },
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        TextInput: {
            defaultProps: {
                radius: 'md',
            },
        },
        Paper: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
