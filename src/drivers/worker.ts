import JobsHandler from "../jobs";
import Redis from "../lib/redis";
import { WorkerProps } from "../types";

class ProcessWorker {
	private redisClient: Redis;
	private handlers?: JobsHandler;
	private name?: string;

	constructor(props: WorkerProps) {
		this.name = props.jobName;
		this.handlers = props.handler;
		this.redisClient = props.redisClient;
	}

	async start(): Promise<void> {
		try {
			if (!this.name) throw new Error("Job name not provided");
			await this.redisClient.subscribe(this.name);
			console.log(`[${this.name.toUpperCase()}] Creazilla Worker started!`);
		} catch (error) {
			console.error(
				`[WORKER] Error starting Creazilla Worker ${this.name?.toUpperCase()}:`,
				error
			);
			this.stop();
		}
	}

	async stop(): Promise<void> {
		await this.redisClient.unsubscribe();
		await this.redisClient.disconnect();
		this.handlers?.flushMapper();
		console.log(`[${this.name}] Creazilla Worker stopped!`);
	}
}

export default ProcessWorker;
