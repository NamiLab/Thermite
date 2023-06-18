import { FastifyRequest, FastifyReply } from "fastify";
export const method = "POST";
export const name = "deploy";

import { generateRandom } from "../utils/UUID.js";
import { createLua } from "../utils/CreateLua.js";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	if (!request.body) return reply.code(400).send({ error: "No body provided" });

	const scriptId = await generateRandom(100);
	cache[scriptId] = request.body;
	console.log(`Deployed script #${Object.keys(cache).length - 1} - Cache size: ${Object.keys(cache).length} items stored`);
	setTimeout(() => {
		delete cache[scriptId];
		console.log(`Script #${scriptId} was auto-purged - Cache size: ${Object.keys(cache).length} items stored`);
	}, 10000);
	reply.code(200).send({ message: "Script deployed", scriptId: scriptId });
};
