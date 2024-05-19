#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const routeName = args[0];

if (!routeName) {
	console.error("Please provide a route name.");
	process.exit(1);
}

const routeContent = `
import { RouteOption } from "../types";

const route: RouteOption = {
	path: "/api/${routeName}",
	method: "get",
	function(req, res, context) {
		res.send("Hello ${routeName}!");
	},
};

export default route;
`;

const routesDir = path.join(__dirname, "../src/routes");
const filePath = path.join(routesDir, `${routeName}.ts`);

if (!fs.existsSync(routesDir)) {
	fs.mkdirSync(routesDir, { recursive: true });
}

fs.writeFileSync(filePath, routeContent.trim(), "utf8");
console.log(`Route generated!\nCheck ${filePath}`);
