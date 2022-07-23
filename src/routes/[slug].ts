import storage from '$lib/redisConnection';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({  params }) => {
	if (params.slug.length > 3) {
		return {
			headers: {
				Location: await storage.get(params.slug)
			},
			status: 302
		};
	} else
		return {
			headers: {
				Location: '/'
			},
			status: 302,
            error: new Error('Short URL doesnt exist')
		};
};
