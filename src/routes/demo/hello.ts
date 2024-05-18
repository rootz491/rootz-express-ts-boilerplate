import { RouteOption } from "../../types";

const route: RouteOption = {
	path: "/hello",
	method: "get",
	function(req, res, context) {
		res.send("Hello World");
	},
};

export default route;
