import RedisClient from "@redis/client/dist/lib/client";
import JobsHandler from "../jobs";
import { JobChannelPayload } from "../types";
import MongoDB from "./mongo";
import config from "../config";
import {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
} from "redis";
import pLimit from "p-limit";

class Redis {
	private limit = pLimit(config.promiseConcurrency);
	private client;
	private subscribers = new Map<
		string,
		RedisClientType<RedisModules, RedisFunctions, RedisScripts>
	>();

	constructor(private handlers?: JobsHandler, private mongoClient?: MongoDB) {
		this.client = new RedisClient(config.redis);
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			console.log("Connected to Redis");
			this.client.on("error", function (error) {
				console.error(error);
				// TODO report it onto a logging service like Sentry.
			});
		} catch (error) {
			console.error("Error connecting to Redis:", error);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.disconnect();
			console.log("Disconnected from Redis");
		} catch (error) {
			console.error("Error disconnecting from Redis:", error);
		}
	}

	async listener(message: string, channel: string): Promise<void> {
		try {
			console.log(`[REDIS] Received message on channel ${channel}`);
			const { key, payload } = JSON.parse(message) as JobChannelPayload;
			const executor = this.handlers?.getJob(channel, key);
			if (executor) {
				try {
					await this.limit(async () =>
						executor({
							service: channel,
							mongo: this.mongoClient,
							payload: JSON.parse(payload),
						})
					);
				} catch (error) {
					console.error(`Error parsing message on channel ${channel}:`, error);
				}
			}
		} catch (error) {
			console.log("Error listening to Redis:", error);
		}
	}

	async subscribe(channel: string): Promise<void> {
		try {
			const subscriber = this.client.duplicate();
			await subscriber.connect();
			await subscriber.subscribe(channel, this.listener.bind(this));
			this.subscribers.set(channel, subscriber);
			console.log(`[REDIS] Subscribed to ${channel}`);
		} catch (error) {
			console.error(`[REDIS] Error subscribing to ${channel}:`, error);
		}
	}

	async publish(
		channel: string,
		key: string,
		payload: any = null
	): Promise<void> {
		try {
			const publisher = this.client.duplicate();
			await publisher.connect();
			await publisher.publish(channel, JSON.stringify({ key, payload }));
			await publisher.disconnect();
			console.log(`[REDIS] Published to ${channel}`);
		} catch (error) {
			console.error(`[REDIS] Error publishing to ${channel} channel:`, error);
		}
	}

	async unsubscribe(): Promise<void> {
		try {
			for (const [channel, subscriber] of this.subscribers) {
				await subscriber.unsubscribe(channel);
				await subscriber.disconnect();
				console.log(`Unsubscribed from ${channel}`);
			}
		} catch (error) {
			console.error(`Error unsubscribing:`, error);
		}
	}
}

export default Redis;
