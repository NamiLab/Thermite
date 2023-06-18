import { FastifyRequest, FastifyReply } from "fastify";
import { execSync } from "node:child_process";

export const method = "GET";
export const name = "ping";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	const startTime = Date.now();
	let result = null;
	try {
		result = execSync(`ping -c 1 ${process.env.PC_IP_ADDR}`).toString();
	} catch (err) {
		console.log(`Ping failed, PC is offline`);
		reply.code(200).send({ message: "offline", ping: Date.now() - startTime, code: 0b00000001 });
	}
	if (result.includes("1 packets transmitted, 1 received")) reply.code(200).send({ message: "online", ping: Date.now() - startTime, code: 0b00000001 });
	reply.code(200).send({ message: "offline", ping: Date.now() - startTime, code: 0b00000001 });
};
