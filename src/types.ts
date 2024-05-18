import JobsHandler from "./jobs";
import MongoDB from "./lib/mongo";
import Redis from "./lib/redis";
import { NextFunction, Request, Response } from "express";

export type WorkerProps = {
	jobName: string;
	handler: JobsHandler;
	redisClient: Redis;
};

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | null;

export type MongoDbName = {
	LOGGER: "logger";
	AUTH: "auth";
	ANALYTICS: "analytics";
	RESOURCE: "resource";
	EDITOR: "editor";
};

export type JobOption<T> = {
	key: string;
	function: (options: OptionsType<T>) => any;
};

export type JobMapper = Record<string, Function>;

export type JobChannelPayload = {
	key: string;
	payload: any;
};

export type RouteContext = {
	mongo: MongoDB;
	redis: Redis;
};

export type MiddlewareOption = {
	priority: number;
	path: string;
	function: (
		req: Request,
		res: Response,
		next: NextFunction,
		context: RouteContext
	) => void;
};

export type RouteOption = {
	method: "get" | "post" | "put" | "delete";
	path: string;
	function: (req: Request, res: Response, context: RouteContext) => any;
};

export type RoutesMapper = Record<string, Array<RouteOption>>;

export type OptionsType<T> = {
	mongo?: MongoDB;
	payload: T;
	callback?: (error: any, result: any) => void;
};
