export async function onRequest(context) {
	const url = new URL(context.request.url);

	if (url.hostname === 'nethourly.pages.dev') {
		const target = new URL(`${url.pathname}${url.search}`, 'https://nethourly.com');
		return Response.redirect(target.toString(), 301);
	}

	return context.next();
}
