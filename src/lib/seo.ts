export const SITE_URL = 'https://nethourly.com';
export const SITE_NAME = 'NetHourly';

export interface FaqItem {
	question: string;
	answer: string;
}

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

export interface WebApplicationOptions {
	name: string;
	description: string;
	path: string;
}

export function faqSchema(items: FaqItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	};
}

export function breadcrumbSchema(items: BreadcrumbItem[], currentPath: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			item: new URL(item.href ?? currentPath, SITE_URL).href,
		})),
	};
}

export function webApplicationSchema({
	name,
	description,
	path,
}: WebApplicationOptions) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name,
		description,
		url: new URL(path, SITE_URL).href,
		applicationCategory: 'FinanceApplication',
		operatingSystem: 'All',
		browserRequirements: 'Requires JavaScript',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
		},
	};
}
