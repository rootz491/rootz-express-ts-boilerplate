import { MongoClient, Collection, Document } from "mongodb";
import config from "../config";

class MongoDB {
	private client: MongoClient;

	constructor() {
		this.client = new MongoClient(config.mongo.connectionString, {
			appName: config.mongo.appName,
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			console.log("Connected to MongoDB");
		} catch (error) {
			console.error("Error connecting to MongoDB:", error);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.close();
			console.log("Disconnected from MongoDB");
		} catch (error) {
			console.error("Error disconnecting from MongoDB:", error);
		}
	}

	async healthCheck(): Promise<any> {
		try {
			const res = await this.client.db("admin").command({ ping: 1 });
			console.log("MongoDB health check passed");
			return res;
		} catch (error) {
			console.error("MongoDB health check failed:", error);
		}
	}

	getCollection<T extends Document>(
		database: string,
		collection: string
	): Collection<T> | undefined {
		const db = this.client.db(database);
		return db.collection(collection);
	}

	async fetchDocumentsPaginated<T extends Document>({
		collection,
		query,
		page,
		limit,
		projection,
	}: {
		collection: Collection<T>;
		query: any;
		projection: any;
		page: number;
		limit: number;
	}) {
		const cursor = collection
			.find(query, { projection })
			.skip(page * limit)
			.limit(limit);
		const res = await cursor.toArray();
		return res;
	}
}

export default MongoDB;
