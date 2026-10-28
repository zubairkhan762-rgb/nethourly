import type { FaqItem } from '../lib/seo';

export const faqBiWeeklyVsSemiMonthly: FaqItem = {
	question: 'What is the difference between bi-weekly and semi-monthly paychecks?',
	answer:
		'Bi-weekly pay arrives every two weeks, producing 26 paychecks a year. Semi-monthly pay arrives twice a month — usually the 1st and 15th — producing 24 paychecks a year. A semi-monthly check is larger because annual pay is split 24 ways instead of 26, but there are two fewer checks each year.',
};

export const faqFica: FaqItem = {
	question: 'What is FICA and how much is deducted from each paycheck?',
	answer:
		'FICA is the mandatory federal payroll tax for Social Security and Medicare. Employees pay 6.2% for Social Security on covered wages plus 1.45% for Medicare, for a combined 7.65% of gross pay. NetHourly applies that 7.65% inside every after-tax estimate; federal and state income tax withholding are separate.',
};

export const faqCaregiverSleepMeals: FaqItem = {
	question: 'Can sleep and meal time be deducted from a 24-hour caregiver shift?',
	answer:
		'Under FLSA rules, up to 8 hours of sleep time may be excluded only when the worker gets at least 5 hours of uninterrupted sleep. Up to 3 duty-free meal hours — typically one hour each for breakfast, lunch, and dinner — may also be excluded. With the full 8 sleep and 3 meal hours excluded, 13 of the 24 hours remain payable. If the worker is on duty or sleep is interrupted below the 5-hour threshold, the time is generally paid.',
};

export const faqCaliforniaDailyOvertime: FaqItem = {
	question: 'How does California daily overtime work on an 8-hour or 12-hour shift?',
	answer:
		'California requires daily overtime based on hours worked in a single workday. The first 8 hours are paid at 1×, hours 8 through 12 are paid at 1.5×, and hours beyond 12 are paid at 2×. A 24-hour shift with no sleep or meal deductions therefore splits into 8 regular, 4 overtime, and 12 double-time hours.',
};

export const faqFlsaWeeklyOvertime: FaqItem = {
	question: 'When does FLSA overtime start — after 8 hours a day or 40 hours a week?',
	answer:
		'Federal FLSA overtime starts after 40 hours worked in a fixed 7-day workweek, not after 8 hours in a day. Daily overtime is a state rule; California is the best-known example. Non-exempt employees must receive at least 1.5× their regular rate for covered overtime hours.',
};

export const faqTakeHomeEstimate: FaqItem = {
	question: 'How accurate is the NetHourly take-home estimate?',
	answer:
		'It is a planning estimate, not tax advice. The standard scenario applies roughly 18% total — FICA at 7.65% plus about 10.35% effective federal income tax. The high-tax scenario uses 24% for states such as California, New York, New Jersey, and Oregon; the no-income-tax scenario uses 15% for states such as Texas, Florida, Washington, and Nevada. Actual withholding depends on filing status, deductions, credits, and location.',
};

export const faqFederalMinimumWage: FaqItem = {
	question: 'What is the federal minimum wage in the U.S. versus state minimum wages?',
	answer:
		'The federal minimum wage is $7.25 per hour, which has remained unchanged since 2009. However, over 30 states and many cities mandate higher rates—ranging from $12 to over $17 per hour in states like California, Washington, and New York. Employers must always pay the higher applicable rate (federal, state, or local).',
};

export const faqAverageHourlyWage: FaqItem = {
	question: 'What is the average hourly wage in the U.S., and what is considered a good starting rate?',
	answer:
		'The average hourly wage in the U.S. ranges between $24 and $28 per hour across all private-sector jobs. For an entry-level or first job (such as retail, food service, or warehouse roles), $15 to $20 per hour is generally considered a competitive starting rate depending on your state\'s cost of living.',
};

export const faqStudentHourlyPay: FaqItem = {
	question: 'How much do college and international students make per hour in the U.S.?',
	answer:
		'Students working part-time or on-campus jobs typically earn between $12 and $20 per hour, depending on the state minimum wage and role. International students on F-1 visas are generally limited to 20 hours per week during active academic terms (40 hours during breaks) and are often exempt from FICA (Social Security and Medicare) taxes under specific IRS student exemptions.',
};

export const CORE_PAYROLL_FAQS: FaqItem[] = [
	faqBiWeeklyVsSemiMonthly,
	faqFica,
	faqCaregiverSleepMeals,
	faqCaliforniaDailyOvertime,
	faqFlsaWeeklyOvertime,
	faqTakeHomeEstimate,
	faqFederalMinimumWage,
	faqAverageHourlyWage,
	faqStudentHourlyPay,
];
