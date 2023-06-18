import { FastifyRequest, FastifyReply } from "fastify";
export const method = "GET";
export const name = "use/:id";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	//@ts-ignore
	const id = request.params?.id;
	if (!id) return reply.code(400).send({ error: "Invalid Script ID" });
	
	let found = false;
	for (const key in cache) {
		if (key === id) {
			reply.type("application/text").code(200).send(cache[key]);
			delete cache[key];
			console.log(`Script #${id} was used up, deleted - Cache size: ${Object.keys(cache).length} items stored`);
			found = true;
			return;
		}
	}
	if (!found) reply.code(404).send({ error: "Script not found" });
};
