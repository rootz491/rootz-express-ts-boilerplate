import express, { Express } from "express";
import config from "../config";
import MongoDB from "../lib/mongo";
import Redis from "../lib/redis";
import RoutesHandler from "../routes";
import { MiddlewareHandler } from "../middlewares";

class Server {
	private app: Express;
	private mongo?: MongoDB;
	private redis?: Redis;
	private RoutesHandler?: RoutesHandler;
	private MiddlewareHandler?: MiddlewareHandler;

	constructor() {
		this.app = express();
		this.mongo = new MongoDB();
		this.redis = new Redis();

		this.RoutesHandler = new RoutesHandler(this.app, {
			mongo: this.mongo,
			redis: this.redis,
		});
		this.MiddlewareHandler = new MiddlewareHandler(this.app, {
			mongo: this.mongo,
			redis: this.redis,
		});
	}

	async init(): Promise<void> {
		try {
			await this.mongo?.connect();
			await this.redis?.connect();
			await this.RoutesHandler?.loadRoutes();
			await this.MiddlewareHandler?.loadMiddlewares();
		} catch (error: any) {
			console.log(error);
			console.error(`Server Error: ${error?.message || error}`);
			await this.mongo?.disconnect();
			process.exit(1);
		}
	}

	public start(): void {
		this.app.listen(config.express.port, () => {
			console.log(`Server is running on port ${config.express.port}`);
		});
	}
}

export default Server;
