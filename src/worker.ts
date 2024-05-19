import ProcessWorker from "./drivers/worker";
import JobsHandler from "./jobs";
import MongoDB from "./lib/mongo";
import Redis from "./lib/redis";

(async () => {
	const mongo = new MongoDB();
	const handler = new JobsHandler();
	const redis = new Redis(handler, mongo);

	try {
		await mongo.connect();
		await redis.connect();

		const defaultWorker = new ProcessWorker({
			jobName: "default",
			handler,
			redisClient: redis,
		});

		defaultWorker.start();
	} catch (error: any) {
		console.error(`Worker Error: ${error?.message || error}`);
		await redis.unsubscribe();
		await redis.disconnect();
		await mongo.disconnect();
		process.exit(1);
	}
})();
