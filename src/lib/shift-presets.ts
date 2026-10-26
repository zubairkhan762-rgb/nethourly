import type { ShiftPayMode } from './payroll';

export interface ShiftPreset {
	id: string;
	label: string;
	shortLabel: string;
	hourlyRate: number;
	totalShiftHours: number;
	shiftsPerWeek: number;
	differential: number;
	sleepEnabled: boolean;
	sleepHours: number;
	mealEnabled: boolean;
	mealHours: number;
	mode: ShiftPayMode;
}

export const SHIFT_PRESETS: ShiftPreset[] = [
	{
		id: 'caregiver',
		label: 'Live-In Caregiver (24-Hr Shift with Sleep/Meal Deduct)',
		shortLabel: 'Live-in caregiver',
		hourlyRate: 20,
		totalShiftHours: 24,
		shiftsPerWeek: 5,
		differential: 0,
		sleepEnabled: true,
		sleepHours: 8,
		mealEnabled: true,
		mealHours: 3,
		mode: 'federal',
	},
	{
		id: 'california',
		label: 'California 24-Hr Shift (8hr Reg + 4hr 1.5x + 12hr 2x)',
		shortLabel: 'California 24-hr',
		hourlyRate: 25,
		totalShiftHours: 24,
		shiftsPerWeek: 3,
		differential: 0,
		sleepEnabled: false,
		sleepHours: 8,
		mealEnabled: false,
		mealHours: 3,
		mode: 'california',
	},
	{
		id: 'firefighter',
		label: 'Firefighter / EMT (24-Hr Straight Pay)',
		shortLabel: 'Firefighter / EMT',
		hourlyRate: 28,
		totalShiftHours: 24,
		shiftsPerWeek: 3,
		differential: 0,
		sleepEnabled: false,
		sleepHours: 8,
		mealEnabled: false,
		mealHours: 3,
		mode: 'flat',
	},
	{
		id: 'nurse',
		label: 'Hospital Nurse (3 x 12-Hr Shifts + Night Diff)',
		shortLabel: 'Hospital nurse',
		hourlyRate: 35,
		totalShiftHours: 12,
		shiftsPerWeek: 3,
		differential: 5,
		sleepEnabled: false,
		sleepHours: 8,
		mealEnabled: false,
		mealHours: 3,
		mode: 'federal',
	},
];

export const DEFAULT_SHIFT_PRESET = SHIFT_PRESETS[0];
