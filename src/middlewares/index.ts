import { Express } from "express";
import { MiddlewareOption, RouteContext } from "../types";
import * as fs from "fs";
import * as path from "path";
import cors from "cors";
import config from "../config";
import helmet from "helmet";

export class MiddlewareHandler {
	constructor(private app: Express, private readonly context: RouteContext) {}

	public async loadMiddlewares(): Promise<void> {
		const files = fs
			.readdirSync(__dirname)
			.filter((file) => !file.endsWith(".map"));

		for (const file of files) {
			const filePath = path.join(__dirname, file);
			const stats = fs.statSync(filePath);
			if (stats.isDirectory()) {
				await this.processFolder(filePath);
			} else {
				await this.processFile(filePath);
			}
		}

		this.app.use(cors(config.express.cors));
		this.app.use(helmet());
	}

	private async processFolder(folderPath: string) {
		const files = fs.readdirSync(folderPath);
		for (const file of files) {
			const filePath = path.join(folderPath, file);
			await this.processFile(filePath);
		}
	}

	private async processFile(filePath: string): Promise<void> {
		const isNotThisFile = __filename !== filePath;
		const stats = fs.statSync(filePath);
		if (stats.isDirectory()) {
			this.processFolder(filePath);
		}

		if (stats.isFile() && filePath.endsWith(".ts") && isNotThisFile) {
			const option = await import(filePath);
			const currentOption = option.default as MiddlewareOption;

			if (currentOption) {
				const { function: func, path } = currentOption;
				this.app.use(path, (req, res, next) => {
					func(req, res, next, this.context);
				});
				console.log(
					`[INFO] Middleware loaded: ${filePath
						.split("\\")
						.pop()
						?.split(".")
						.shift()} [scope: ${path}]`
				);
			}
		}
	}
}
