import { createClient } from 'redis';
import log from './log';
import env from './env';

const client = createClient({ url: process.env.REDIS_URL as string });

let connectPromise: Promise<void> | undefined;
let errorOnce = true;
async function autoConnect(): Promise<void> {
	if (!connectPromise) {
		errorOnce = true;
		connectPromise = new Promise((resolve, reject) => {
			client.once('error', (err) => reject(new Error(`Redis: ${err.message}`)));
			client.connect().then(resolve, reject);
		});
	}
	await connectPromise;
}
client.on('error', (err) => {
	if (errorOnce) {
		log.error('Redis:', err);
		errorOnce = false;
	}
});
client.on('connect', () => {
	log('Redis up');
});
client.on('disconnect', () => {
	connectPromise = undefined;
	log('Redis down');
});
async function get<T>(key: string): Promise<T | undefined>;
async function get<T>(key: string, fallback: T): Promise<T>;
async function get<T>(key: string, fallback?: T): Promise<T | undefined> {
	await autoConnect();
	const value = await client.get(key);
	if (value === null) {
		return fallback;
	}
	return JSON.parse(value);
}
async function set(
	key: string,
	value: unknown,
	options?: { ttl: number } // TTL in seconds
): Promise<void> {
	const data = JSON.stringify(value);
	const config = options ? { EX: options.ttl } : {};
	await autoConnect();
	await client.set(key, data, config);
	await client.publish(key, data);
}
const storage = {
	get,
	set
};
export default storage;
