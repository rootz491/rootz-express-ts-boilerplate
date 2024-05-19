import { JobOption } from "../types";

type RedisPayload = {
	key: string;
	value: string;
};

const job: JobOption<RedisPayload> = {
	key: "hello",
	function: async ({ mongo, payload, callback }) => {
		// you can also perform mongo operations here
		console.log(`[JOB] Received payload: Hello "${payload.value}"!`);
	},
};

export default job;
