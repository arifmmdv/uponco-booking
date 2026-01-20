// ============================================================================
// Time Slot Card Component
// ============================================================================

'use client';

import { UnstyledButton, Text } from '@mantine/core';
import type { TimeSlot } from '@/types/booking';

interface TimeSlotCardProps {
    slot: TimeSlot;
    selected?: boolean;
    onClick?: () => void;
}

export function TimeSlotCard({ slot, selected = false, onClick }: TimeSlotCardProps) {
    const isDisabled = !slot.available;

    return (
        <UnstyledButton
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            style={{
                padding: '10px 16px',
                borderRadius: 'var(--mantine-radius-md)',
                border: `1px solid ${selected
                        ? 'var(--mantine-color-cyan-6)'
                        : isDisabled
                            ? 'var(--mantine-color-gray-3)'
                            : 'var(--mantine-color-gray-4)'
                    }`,
                borderWidth: selected ? 2 : 1,
                backgroundColor: selected
                    ? 'var(--mantine-color-cyan-light)'
                    : isDisabled
                        ? 'var(--mantine-color-gray-1)'
                        : 'transparent',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
            }}
        >
            <Text
                size="sm"
                fw={selected ? 600 : 500}
                c={isDisabled ? 'dimmed' : selected ? 'cyan.7' : undefined}
            >
                {slot.time}
            </Text>
        </UnstyledButton>
    );
}
