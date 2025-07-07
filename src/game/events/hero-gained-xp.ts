import { createEventDefinition } from 'ts-bus';

export const heroGainedXp = createEventDefinition<{ amount: number }>()('heroGainedXp');
