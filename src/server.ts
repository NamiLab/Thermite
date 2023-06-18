import fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = fastify({ logger: false })
	.register(cors, {
		origin: "*",
		methods: ["GET", "PUT", "POST", "DELETE"],
	});
let cache: any = {};

await Promise.all(
	readdirSync(join(__dirname, "routes")).map(async (file) => {
		if (!file.endsWith(".js")) return;
		const route = await import(join(__dirname, "routes", file));
		console.log(route);
		server.route({
			method: route.method,
			url: `/api/${route.name}`,
			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				try {
					let result = await route.run(request, reply, cache);
					if (result) return result;
					else reply.code(204).send();
				} catch (e) {
					reply.type("application/json").code(500).send({ error: "Server exception occured", endpointUrl: `/api/${route.name}`, thrownError: `${e}` });
				}
			}
		});
	})
);

server.addHook("onRequest", (request: FastifyRequest, reply: FastifyReply, done) => {
	console.log(`${request.method} ${request.url} by ${request.headers["x-forwarded-for"] || request.ip}`);
	done();
});
server.listen({ port: 6363, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server listening at ${address}`);
});
