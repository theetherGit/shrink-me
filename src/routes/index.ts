import storage from '$lib/redisConnection';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	await storage.set(data.key, data.url);
	return {
		body: {
			status: 200,
			error: null
		}
	};
};
