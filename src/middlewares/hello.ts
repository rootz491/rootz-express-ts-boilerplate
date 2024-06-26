import { MiddlewareOption } from "../types";

const middleware: MiddlewareOption = {
	priority: 1,
	path: "/api/*",
	function: (_req, _res, next, _context) => {
		console.log("[MIDDLEWARE] Hello, Mom!");
		next();
	},
};

export default middleware;
