import * as fs from "fs";
import * as path from "path";
import { RouteContext, RouteOption } from "../types";
import { Express } from "express";
import { isValidRequestMethod } from "../helper/express";

class RoutesHandler {
	constructor(
		private app: Express,
		private readonly context: RouteContext // context is the object that holds all the services' instances
	) {}

	public async loadRoutes(): Promise<void> {
		const files = fs
			.readdirSync(__dirname)
			.filter((file) => !file.endsWith(".map"));

		for (const file of files) {
			const filePath = path.join(__dirname, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				this.processFolder(filePath);
			} else {
				this.processFile(filePath);
			}
		}

		this.app.use("*", (req, res) => {
			res.status(404).json({ message: "Route not found" });
		});
	}

	async processFolder(folderPath: string) {
		const files = fs.readdirSync(folderPath);
		for (const file of files) {
			const filePath = path.join(folderPath, file);
			await this.processFile(filePath);
		}
	}

	async processFile(filePath: string): Promise<void> {
		const isNotThisFile = __filename !== filePath;
		const stats = fs.statSync(filePath);
		if (stats.isDirectory()) {
			this.processFolder(filePath);
		}

		if (stats.isFile() && filePath.endsWith(".ts") && isNotThisFile) {
			const option = await import(filePath);
			const currentOption = option.default as RouteOption;

			if (currentOption) {
				const { method, path, function: func } = currentOption;

				if (!isValidRequestMethod(method)) {
					throw new Error(`[ERROR] Invalid request method: ${method}`);
				}

				// Register the route
				this.app[method](path, (req, res) => func(req, res, this.context));
				console.log(`[INFO] Route loaded: ${method.toUpperCase()} ${path}`);
			}
		}
	}
}

export default RoutesHandler;
