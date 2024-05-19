import { Collection, Document, Filter, FindOptions } from "mongodb";
import MongoDB from "../../lib/mongo";
import { HelloEntity } from "./entity";
import config from "../../config";

export class HelloModel extends MongoDB {
	private collection: Collection<HelloEntity>;
	private readonly database = config.mongo.databases.primary;

	constructor() {
		super();
		this.collection = this.getCollection<HelloEntity>(this.database, "hello")!;
	}

	async create(data: HelloEntity) {
		return await this.collection.insertOne(data);
	}

	query(query: Filter<HelloEntity>, options: FindOptions<Document> = {}) {
		return this.collection.find(query, options).toArray();
	}

	update(query: Filter<HelloEntity>, data: Partial<HelloEntity>) {
		return this.collection.updateOne(query, { $set: data });
	}

	delete(query: Filter<HelloEntity>) {
		return this.collection.deleteOne(query);
	}
}

const helloModel = new HelloModel();
export default helloModel;
