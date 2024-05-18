import * as fs from "fs";
import * as path from "path";
import { JobMapper, JobOption } from "../types";

class JobsHandler {
	private mapper: JobMapper = {};

	constructor() {
		this.createMapper();
	}

	private createMapper(): void {
		const files = fs
			.readdirSync(__dirname)
			.filter((file) => !file.endsWith(".map"));

		for (const file of files) {
			const filePath = path.join(__dirname, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				this.processDirectory(filePath);
			} else if (
				stats.isFile() &&
				filePath.endsWith(".ts") &&
				filePath !== __filename
			) {
				this.processFile(filePath);
			}
		}
	}

	public flushMapper(): void {
		this.mapper = {};
	}

	private processDirectory(directoryPath: string): void {
		const files = fs.readdirSync(directoryPath);

		for (const file of files) {
			const filePath = path.join(directoryPath, file);
			const stats = fs.statSync(filePath);

			if (
				stats.isFile() &&
				(filePath.endsWith(".ts") || filePath.endsWith(".js"))
			) {
				this.processFile(filePath);
			} else if (stats.isDirectory()) {
				this.processDirectory(filePath);
			}
		}
	}

	private async processFile(filePath: string): Promise<void> {
		const option = await import(filePath);

		const currentOption = option.default as JobOption<any>;

		if (currentOption) {
			const { key, function: func } = currentOption;
			this.mapper[key] = func;
			console.log(`[INFO] Job ${key} loaded.`);
		}
	}

	public getJob(service: string, key: string): Function | undefined {
		const job = this.mapper[key];
		if (!job) {
			console.warn(`[WARNING] Job ${key} not found in service ${service}`);
			return;
		}
		return job;
	}
}

export default JobsHandler;
