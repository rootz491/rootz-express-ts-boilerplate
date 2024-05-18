import { JobOption } from "../types";

type RedisPayload = {
	key: string;
	value: string;
};

const job: JobOption<RedisPayload> = {
	key: "hello",
	function: async ({ mongo, payload, callback }) => {
		// you can also perform mongo operations here
		console.log("Hello Mom!", payload);
	},
};

export default job;
