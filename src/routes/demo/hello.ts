import { RouteOption } from "../../types";

const route: RouteOption = {
	path: "/api/hello",
	method: "get",
	function(req, res, context) {
		context.redis.publish(
			"default", // channel
			"hello", // job-key
			"mom" // payload
		);
		res.send("Hello World");
	},
};

export default route;
