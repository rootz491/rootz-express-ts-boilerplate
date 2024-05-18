import { RedisClientOptions } from "redis";
import { LoggerOptions } from "winston";
import { CorsOptions } from "cors";
import { HelmetOptions } from "helmet";

type Config = {
	promiseConcurrency: number;
	mongo: {
		appName?: string;
		connectionString: string;
		databases: Record<string, string>;
	};
	redis: RedisClientOptions;
	express: {
		port: number;
		cors?: CorsOptions;
		helmet?: HelmetOptions;
	};
	winston: LoggerOptions;
};

const config: Config = {
	promiseConcurrency: 5,
	mongo: {
		appName: "Rootz Template",
		connectionString: "mongodb://localhost:27017/",
		databases: {
			primary: "rootz-express-ts-template",
		},
	},
	redis: {
		url: "redis://localhost:6379",
	},
	express: {
		port: 9999,
		cors: {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Content-Type", "Authorization"],
		},
		helmet: {
			contentSecurityPolicy: false,
			xXssProtection: true,
		},
	},
	winston: {
		silent: false,
		levels: {},
		format: {
			transform: (info: any) => {
				console.log(info);
				return info;
			},
		},
		transports: [],
	},
};

export default config;
