export const STANDARD_WEEK_HOURS = 40;
export const FICA_RATE = 0.0765;
export const WEEKS_PER_YEAR = 52;

export const TAX_SCENARIOS = {
  standard: { label: 'Standard single filer', rate: 0.18 },
  fica: { label: 'FICA only', rate: FICA_RATE },
  highTax: { label: 'High-tax state', rate: 0.24 },
  noIncomeTax: { label: 'No income tax state', rate: 0.15 },
  gross: { label: 'Gross pay', rate: 0 },
} as const;

export type TaxScenario = keyof typeof TAX_SCENARIOS;

export const STATE_TAX_PROFILES = {
  noState: {
    label: 'No state tax',
    states: 'TX, FL, WA, NV, TN',
    stateRate: 0,
  },
  lowState: {
    label: 'Low/flat state tax',
    states: 'PA, IL, IN, CO',
    stateRate: 0.04,
  },
  moderateState: {
    label: 'Moderate state tax',
    states: 'NY, VA, GA, NC',
    stateRate: 0.055,
  },
  highState: {
    label: 'High state tax',
    states: 'CA, NJ, OR, MN',
    stateRate: 0.085,
  },
} as const;

export type StateTaxProfile = keyof typeof STATE_TAX_PROFILES;

const FEDERAL_STANDARD_DEDUCTION = 15000;

const FEDERAL_BRACKETS = [
  { upTo: 11925, rate: 0.1 },
  { upTo: 48475, rate: 0.12 },
  { upTo: 103350, rate: 0.22 },
  { upTo: 197300, rate: 0.24 },
  { upTo: 250525, rate: 0.32 },
  { upTo: 626350, rate: 0.35 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
] as const;

export function estimateFederalIncomeTax(annualGross: number): number {
  const taxableIncome = Math.max(
    0,
    (Number.isFinite(annualGross) ? annualGross : 0) - FEDERAL_STANDARD_DEDUCTION,
  );

  let tax = 0;
  let previous = 0;

  for (const bracket of FEDERAL_BRACKETS) {
    const amount = Math.min(taxableIncome, bracket.upTo) - previous;
    if (amount <= 0) break;
    tax += amount * bracket.rate;
    previous = bracket.upTo;
    if (taxableIncome <= bracket.upTo) break;
  }

  return tax;
}

export function getFederalMarginalRate(annualGross: number): number {
  const taxableIncome = Math.max(
    0,
    (Number.isFinite(annualGross) ? annualGross : 0) - FEDERAL_STANDARD_DEDUCTION,
  );

  for (const bracket of FEDERAL_BRACKETS) {
    if (taxableIncome <= bracket.upTo) return bracket.rate;
  }

  return FEDERAL_BRACKETS[FEDERAL_BRACKETS.length - 1].rate;
}

export interface TakeHomeEstimate {
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  totalTax: number;
  federalRate: number;
  stateRate: number;
  ficaRate: number;
  totalRate: number;
  netAnnual: number;
}

export function estimateTakeHome(
  annualGross: number,
  profileKey: StateTaxProfile,
): TakeHomeEstimate {
  const gross = Math.max(0, Number.isFinite(annualGross) ? annualGross : 0);
  const profile = STATE_TAX_PROFILES[profileKey] ?? STATE_TAX_PROFILES.noState;
  const federalTax = estimateFederalIncomeTax(gross);
  const stateTax = gross * profile.stateRate;
  const ficaTax = gross * FICA_RATE;
  const totalTax = federalTax + stateTax + ficaTax;

  return {
    federalTax,
    stateTax,
    ficaTax,
    totalTax,
    federalRate: gross > 0 ? federalTax / gross : 0,
    stateRate: profile.stateRate,
    ficaRate: FICA_RATE,
    totalRate: gross > 0 ? totalTax / gross : 0,
    netAnnual: gross - totalTax,
  };
}

export interface StandardInput {
  hourlyRate: number;
  hoursPerWeek: number;
  doubleTimeHours: number;
  weeksPerYear: number;
  overtimeRate?: number;
}

export interface ShiftInput {
  hourlyRate: number;
  shiftsPerWeek: number;
  sleepDeduction: number;
  mealDeduction: number;
  dailyOvertime: boolean;
  weeksPerYear: number;
}

export interface PayResult {
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  totalHours: number;
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  weeklyGross: number;
  annualGross: number;
}

export interface FrequencyRow {
  key: string;
  label: string;
  periodsLabel: string;
  gross: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const toAmount = (value: number) => (Number.isFinite(value) ? Math.max(0, value) : 0);

function buildResult(
  hourlyRate: number,
  regularHours: number,
  overtimeHours: number,
  doubleTimeHours: number,
  weeksPerYear: number,
  overtimeRate = 1.5,
): PayResult {
  const overtimeMultiplier = overtimeRate === 2 ? 2 : 1.5;
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * overtimeMultiplier;
  const doubleTimePay = doubleTimeHours * hourlyRate * 2;
  const weeklyGross = regularPay + overtimePay + doubleTimePay;

  return {
    regularHours,
    overtimeHours,
    doubleTimeHours,
    totalHours: regularHours + overtimeHours + doubleTimeHours,
    regularPay,
    overtimePay,
    doubleTimePay,
    weeklyGross,
    annualGross: weeklyGross * weeksPerYear,
  };
}

export function calculateStandard(input: StandardInput): PayResult {
  const hourlyRate = toAmount(input.hourlyRate);
  const overtimeRate = input.overtimeRate === 2 ? 2 : 1.5;
  const weeksPerYear = clamp(toAmount(input.weeksPerYear), 1, 52);
  const totalHours = clamp(toAmount(input.hoursPerWeek), 0, 168);
  const doubleTimeHours = clamp(toAmount(input.doubleTimeHours), 0, totalHours);
  const straightTimeHours = totalHours - doubleTimeHours;
  const regularHours = Math.min(straightTimeHours, STANDARD_WEEK_HOURS);
  const overtimeHours = Math.max(0, straightTimeHours - STANDARD_WEEK_HOURS);

  return buildResult(
    hourlyRate,
    regularHours,
    overtimeHours,
    doubleTimeHours,
    weeksPerYear,
    overtimeRate,
  );
}

export function calculateShift(input: ShiftInput): PayResult {
  const hourlyRate = toAmount(input.hourlyRate);
  const weeksPerYear = clamp(toAmount(input.weeksPerYear), 1, 52);
  const shiftsPerWeek = clamp(toAmount(input.shiftsPerWeek), 0, 7);
  const sleepDeduction = clamp(toAmount(input.sleepDeduction), 0, 8);
  const mealDeduction = clamp(toAmount(input.mealDeduction), 0, 3);
  const payablePerShift = Math.max(0, 24 - sleepDeduction - mealDeduction);

  if (input.dailyOvertime) {
    const regularHours = Math.min(payablePerShift, 8) * shiftsPerWeek;
    const overtimeHours =
      Math.min(Math.max(payablePerShift - 8, 0), 4) * shiftsPerWeek;
    const doubleTimeHours = Math.max(payablePerShift - 12, 0) * shiftsPerWeek;

    return buildResult(
      hourlyRate,
      regularHours,
      overtimeHours,
      doubleTimeHours,
      weeksPerYear,
    );
  }

  const weeklyPayableHours = payablePerShift * shiftsPerWeek;
  const regularHours = Math.min(weeklyPayableHours, STANDARD_WEEK_HOURS);
  const overtimeHours = Math.max(0, weeklyPayableHours - STANDARD_WEEK_HOURS);

  return buildResult(hourlyRate, regularHours, overtimeHours, 0, weeksPerYear);
}

export type ShiftPayMode = 'federal' | 'california' | 'flat';

export interface ShiftWeekInput {
  hourlyRate: number;
  differential: number;
  totalShiftHours: number;
  shiftsPerWeek: number;
  sleepHours: number;
  mealHours: number;
  mode: ShiftPayMode;
}

export interface ShiftHours {
  regular: number;
  overtime: number;
  doubleTime: number;
  unpaid: number;
}

export interface ShiftWeekResult {
  effectiveRate: number;
  payablePerShift: number;
  unpaidPerShift: number;
  perShiftHours: ShiftHours;
  weeklyHours: {
    regular: number;
    overtime: number;
    doubleTime: number;
    total: number;
  };
  perShiftPay: {
    regular: number;
    overtime: number;
    doubleTime: number;
    gross: number;
  };
  weeklyPay: {
    regular: number;
    overtime: number;
    doubleTime: number;
    gross: number;
  };
  weeklyGross: number;
  biWeeklyGross: number;
  monthlyGross: number;
  annualGross: number;
}

export function calculateShiftWeek(input: ShiftWeekInput): ShiftWeekResult {
  const baseRate = toAmount(input.hourlyRate);
  const differential = clamp(toAmount(input.differential), 0, 10);
  const effectiveRate = baseRate + differential;
  const totalShiftHours = clamp(toAmount(input.totalShiftHours), 8, 24);
  const shiftsPerWeek = clamp(toAmount(input.shiftsPerWeek), 1, 7);
  const sleepHours = clamp(toAmount(input.sleepHours), 0, 8);
  const mealHours = clamp(toAmount(input.mealHours), 0, 3);
  const payablePerShift = Math.max(0, totalShiftHours - sleepHours - mealHours);
  const unpaidPerShift = totalShiftHours - payablePerShift;

  let weeklyRegularHours = 0;
  let weeklyOvertimeHours = 0;
  let weeklyDoubleTimeHours = 0;

  if (input.mode === 'california') {
    weeklyRegularHours = Math.min(payablePerShift, 8) * shiftsPerWeek;
    weeklyOvertimeHours =
      Math.min(Math.max(payablePerShift - 8, 0), 4) * shiftsPerWeek;
    weeklyDoubleTimeHours = Math.max(payablePerShift - 12, 0) * shiftsPerWeek;
  } else if (input.mode === 'flat') {
    weeklyRegularHours = payablePerShift * shiftsPerWeek;
  } else {
    const weeklyPayableHours = payablePerShift * shiftsPerWeek;
    weeklyRegularHours = Math.min(weeklyPayableHours, STANDARD_WEEK_HOURS);
    weeklyOvertimeHours = Math.max(0, weeklyPayableHours - STANDARD_WEEK_HOURS);
  }

  const weeklyRegularPay = weeklyRegularHours * effectiveRate;
  const weeklyOvertimePay = weeklyOvertimeHours * effectiveRate * 1.5;
  const weeklyDoubleTimePay = weeklyDoubleTimeHours * effectiveRate * 2;
  const weeklyGross =
    weeklyRegularPay + weeklyOvertimePay + weeklyDoubleTimePay;

  const perShiftFactor = shiftsPerWeek > 0 ? shiftsPerWeek : 1;

  return {
    effectiveRate,
    payablePerShift,
    unpaidPerShift,
    perShiftHours: {
      regular: weeklyRegularHours / perShiftFactor,
      overtime: weeklyOvertimeHours / perShiftFactor,
      doubleTime: weeklyDoubleTimeHours / perShiftFactor,
      unpaid: unpaidPerShift,
    },
    weeklyHours: {
      regular: weeklyRegularHours,
      overtime: weeklyOvertimeHours,
      doubleTime: weeklyDoubleTimeHours,
      total: weeklyRegularHours + weeklyOvertimeHours + weeklyDoubleTimeHours,
    },
    perShiftPay: {
      regular: weeklyRegularPay / perShiftFactor,
      overtime: weeklyOvertimePay / perShiftFactor,
      doubleTime: weeklyDoubleTimePay / perShiftFactor,
      gross: weeklyGross / perShiftFactor,
    },
    weeklyPay: {
      regular: weeklyRegularPay,
      overtime: weeklyOvertimePay,
      doubleTime: weeklyDoubleTimePay,
      gross: weeklyGross,
    },
    weeklyGross,
    biWeeklyGross: weeklyGross * 2,
    monthlyGross: (weeklyGross * WEEKS_PER_YEAR) / 12,
    annualGross: weeklyGross * WEEKS_PER_YEAR,
  };
}

export interface OvertimeInput {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
}

export interface OvertimeResult {
  baseRate: number;
  timeAndHalfRate: number;
  doubleTimeRate: number;
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  weeklyGross: number;
  biWeeklyGross: number;
  semiMonthlyGross: number;
  monthlyGross: number;
  annualGross: number;
  totalHours: number;
}

export function calculateOvertime(input: OvertimeInput): OvertimeResult {
  const baseRate = toAmount(input.hourlyRate);
  const regularHours = clamp(toAmount(input.regularHours), 0, 168);
  const overtimeHours = clamp(toAmount(input.overtimeHours), 0, 168);
  const doubleTimeHours = clamp(toAmount(input.doubleTimeHours), 0, 168);
  const timeAndHalfRate = baseRate * 1.5;
  const doubleTimeRate = baseRate * 2;
  const regularPay = regularHours * baseRate;
  const overtimePay = overtimeHours * timeAndHalfRate;
  const doubleTimePay = doubleTimeHours * doubleTimeRate;
  const weeklyGross = regularPay + overtimePay + doubleTimePay;
  const annualGross = weeklyGross * WEEKS_PER_YEAR;

  return {
    baseRate,
    timeAndHalfRate,
    doubleTimeRate,
    regularPay,
    overtimePay,
    doubleTimePay,
    weeklyGross,
    biWeeklyGross: weeklyGross * 2,
    semiMonthlyGross: annualGross / 24,
    monthlyGross: annualGross / 12,
    annualGross,
    totalHours: regularHours + overtimeHours + doubleTimeHours,
  };
}

export function getFrequencyRows(
  result: PayResult,
  hourlyRate: number,
  weeksPerYear: number,
): FrequencyRow[] {
  const weekly = result.weeklyGross;
  const annual = result.annualGross;
  const hoursPerYear = Math.round(result.totalHours * weeksPerYear);

  return [
    {
      key: 'hourly',
      label: 'Hourly',
      periodsLabel: `${hoursPerYear.toLocaleString('en-US')} hrs`,
      gross: toAmount(hourlyRate),
    },
    {
      key: 'daily',
      label: 'Daily',
      periodsLabel: '260 days',
      gross: weekly / 5,
    },
    {
      key: 'weekly',
      label: 'Weekly',
      periodsLabel: '52',
      gross: weekly,
    },
    {
      key: 'biweekly',
      label: 'Bi-weekly',
      periodsLabel: '26',
      gross: weekly * 2,
    },
    {
      key: 'semimonthly',
      label: 'Semi-monthly',
      periodsLabel: '24',
      gross: annual / 24,
    },
    {
      key: 'monthly',
      label: 'Monthly',
      periodsLabel: '12',
      gross: annual / 12,
    },
    {
      key: 'annual',
      label: 'Annual',
      periodsLabel: '1',
      gross: annual,
    },
  ];
}
