export const FULL_TIME_HOURS = 40;
export const WEEKS_PER_YEAR = 52;

export interface WageEntry {
	rate: number;
	slug: string;
	display: string;
	value: string;
	note?: string;
}

export interface WageStats {
	rate: number;
	daily: number;
	weekly: number;
	biWeekly: number;
	semiMonthly: number;
	monthly: number;
	annual: number;
	overtimeRate: number;
	doubleTimeRate: number;
}

export interface TaxTier {
	key: string;
	label: string;
	short: string;
	note: string;
	rate: number;
}

export interface StateMinimumWage {
	state: string;
	abbr: string;
	rate: number;
	note: string;
}

export interface WageCategory {
	id: string;
	title: string;
	range: string;
	description: string;
	min: number;
	max: number;
}

export function formatUSD(value: number, decimals = 0): string {
	return value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

export function formatRate(value: number): string {
	const rounded = Math.round(value * 100) / 100;
	return Number.isInteger(rounded) ? formatUSD(rounded, 0) : formatUSD(rounded, 2);
}

export function toWageSlug(rate: number): string {
	const value = Number.isInteger(rate) ? String(rate) : rate.toFixed(2).replace('.', '-');
	return `${value}-an-hour`;
}

export function getWageStats(rate: number): WageStats {
	const weekly = rate * FULL_TIME_HOURS;
	const annual = weekly * WEEKS_PER_YEAR;

	return {
		rate,
		daily: weekly / 5,
		weekly,
		biWeekly: weekly * 2,
		semiMonthly: annual / 24,
		monthly: annual / 12,
		annual,
		overtimeRate: rate * 1.5,
		doubleTimeRate: rate * 2,
	};
}

export const WAGE_TAX_TIERS: TaxTier[] = [
	{
		key: 'gross',
		label: 'Gross Pay (0% Tax)',
		short: 'Gross',
		note: 'Before any withholding',
		rate: 0,
	},
	{
		key: 'no-income-tax',
		label: 'No-Income-Tax State (~15%)',
		short: 'No income tax',
		note: 'TX, FL, WA — FICA + federal',
		rate: 0.15,
	},
	{
		key: 'standard',
		label: 'US Standard Single Filer (~18%)',
		short: 'Standard',
		note: 'FICA + effective federal',
		rate: 0.18,
	},
	{
		key: 'high-tax',
		label: 'High-Tax State (~24%)',
		short: 'High tax',
		note: 'CA, NY, NJ — FICA + state',
		rate: 0.24,
	},
];

export const STATE_MINIMUM_WAGES: StateMinimumWage[] = [
	{ state: 'Federal (FLSA)', abbr: 'US', rate: 7.25, note: 'Federal floor' },
	{ state: 'California', abbr: 'CA', rate: 16.0, note: 'State minimum' },
	{ state: 'California fast food', abbr: 'CA', rate: 20.0, note: 'Fast-food sector' },
	{ state: 'Washington', abbr: 'WA', rate: 16.28, note: 'State minimum' },
	{ state: 'New York', abbr: 'NY', rate: 16.0, note: 'State minimum' },
	{ state: 'Texas', abbr: 'TX', rate: 7.25, note: 'Federal rate applies' },
	{ state: 'Florida', abbr: 'FL', rate: 13.0, note: 'State minimum' },
	{ state: 'Illinois', abbr: 'IL', rate: 14.0, note: 'State minimum' },
	{ state: 'Arizona', abbr: 'AZ', rate: 14.35, note: 'State minimum' },
];

export const WAGE_CATEGORIES: WageCategory[] = [
	{
		id: 'entry-level',
		title: 'Entry-Level & Minimum Wages',
		range: '$7.25 – $16.28/hr',
		description:
			'Federal and state minimums, first jobs, tipped roles, and entry-level retail or food service pay.',
		min: 0,
		max: 16.28,
	},
	{
		id: 'mid-range',
		title: 'Mid-Range & Retail/Warehouse Wages',
		range: '$16.50 – $25/hr',
		description:
			'Warehouse, logistics, retail supervisor, administrative, and skilled service roles.',
		min: 16.29,
		max: 25,
	},
	{
		id: 'skilled',
		title: 'Skilled Trade, Nursing & Tech Hourly Rates',
		range: '$26 – $50/hr',
		description:
			'Licensed trades, nurses, technicians, contractors, and experienced individual contributors.',
		min: 25.01,
		max: 50,
	},
	{
		id: 'high-earners',
		title: 'High-Earner & Contractor Rates',
		range: '$51 – $100/hr',
		description:
			'Senior contractors, specialist consultants, travel nurses, and high-skill hourly engagements.',
		min: 50.01,
		max: Number.POSITIVE_INFINITY,
	},
];

const noteFor = (rate: number): string | undefined => {
	if (rate === 7.25) return 'Federal minimum wage';
	if (rate === 15) return '$15 minimum-wage benchmark';
	if (rate === 16.28) return 'Washington state minimum wage';
	if (rate === 20) return 'California fast-food minimum wage';
	return undefined;
};

const wholeDollarRates = Array.from({ length: 75 - 8 + 1 }, (_, index) => 8 + index);
const highWholeRates = [80, 85, 90, 95, 100];
const decimalRates = [
	7.25, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.28, 16.5, 17.5, 18.5, 19.5,
	20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 32.5, 34.5,
	37.5, 42.5, 45.5,
];

const allRates = Array.from(
	new Set([...wholeDollarRates, ...highWholeRates, ...decimalRates]),
).sort((a, b) => a - b);

export const WAGES: WageEntry[] = allRates.map((rate) => ({
	rate,
	slug: toWageSlug(rate),
	display: formatRate(rate),
	value: Number.isInteger(rate) ? String(rate) : rate.toFixed(2),
	note: noteFor(rate),
}));

const popularRates = [7.25, 10, 12, 15, 16, 17, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50];

export const POPULAR_WAGES: WageEntry[] = popularRates
	.map((rate) => WAGES.find((wage) => wage.rate === rate))
	.filter((wage): wage is WageEntry => Boolean(wage));

export function getWageBySlug(slug: string): WageEntry | undefined {
	return WAGES.find((wage) => wage.slug === slug);
}

export function getWageIndex(slug: string): number {
	return WAGES.findIndex((wage) => wage.slug === slug);
}

export function getWagesForCategory(category: WageCategory): WageEntry[] {
	return WAGES.filter((wage) => wage.rate >= category.min && wage.rate <= category.max);
}

export function getNearbyWages(slug: string, count = 6): WageEntry[] {
	const current = getWageBySlug(slug);
	if (!current) return [];

	return WAGES.filter((wage) => wage.slug !== slug)
		.sort(
			(a, b) =>
				Math.abs(a.rate - current.rate) - Math.abs(b.rate - current.rate) ||
				a.rate - b.rate,
		)
		.slice(0, count)
		.sort((a, b) => a.rate - b.rate);
}
