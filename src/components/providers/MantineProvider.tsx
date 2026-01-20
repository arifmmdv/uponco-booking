// ============================================================================
// Mantine Provider Component
// ============================================================================

'use client';

import { MantineProvider as MantineProviderBase, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/theme/theme';

interface MantineProviderProps {
    children: React.ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
    return (
        <MantineProviderBase theme={theme} defaultColorScheme="auto">
            <Notifications position="top-right" />
            {children}
        </MantineProviderBase>
    );
}

export { ColorSchemeScript };
