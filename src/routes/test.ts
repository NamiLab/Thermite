import { FastifyRequest, FastifyReply } from "fastify";
export const method = "GET";
export const name = "test";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	reply.code(200).send({ message: "active" });
};
