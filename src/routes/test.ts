import { RouteOption } from "../types";

const route: RouteOption = {
	path: "/api/test",
	method: "get",
	function(req, res, context) {
		res.send("Hello test!");
	},
};

export default route;