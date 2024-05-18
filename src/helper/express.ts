export const isValidRequestMethod = (method: string): boolean => {
	return ["get", "post", "put", "delete"].includes(method);
};
