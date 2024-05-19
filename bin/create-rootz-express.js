#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define the repo URL
const repoURL = "https://github.com/rootz491/rootz-express-boilerplate.git";

// Get the project name from the command line arguments
const projectName = process.argv[2];

// Create a new directory for the project
if (!projectName) {
	console.error("Please provide a project name.");
	process.exit(1);
}

const projectPath = path.resolve(process.cwd(), projectName);
fs.mkdirSync(projectPath);

// Clone the repository
execSync(`git clone ${repoURL} ${projectPath}`, { stdio: "inherit" });

// Remove the .git directory
fs.rmSync(path.join(projectPath, ".git"), { recursive: true, force: true });

console.log("Project setup complete!");
