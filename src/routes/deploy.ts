import { FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "crypto";
import axios from "axios";
export const method = "POST";
export const name = "deploy";

import { createLua } from "../utils/CreateLua.js";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	if (!request.body) return reply.code(400).send({ error: "No body provided" });
	//@ts-ignore
	let burnTime = request.query?.burnTime;
	if (!burnTime) burnTime = 120000;
	if (burnTime > 600000) burnTime = 600000;

	const scriptId = randomUUID();
	cache[scriptId] = {
		script: request.body,
		burnTime: burnTime,
		//@ts-ignore
		webhook: request.query?.webhookUrl ? request.query?.webhookUrl : null,
	};
	console.log(`Deployed script #${Object.keys(cache).length - 1} - Cache size: ${Object.keys(cache).length} items stored`);
	
	if (cache[scriptId].webhook) {
		axios.post(cache[scriptId].webhook, {
			embeds: [
				{
					title: "Deployed to Thermite",
					description: `Script (\`${scriptId}\`) was deployed <t:${Math.floor(Date.now() / 1000)}:R>, it will become unusable <t:${Math.floor((Date.now() + burnTime) / 1000)}:R>.\n\nYou can use it by sending a GET request to the endpoint: \`/api/use/${scriptId}\``,
					color: 9109357,
					footer: {
						text: "Thermite",
						icon_url: "https://github.com/NamiLab/Thermite/blob/main/gitassets/therm2.png?raw=true"
					}
				}
			],
		}).catch((err) => {
			console.warn(`Failed to send webhook: ${err}`);
		});
	}
	
	setTimeout(() => {
		if (!cache[scriptId]) return;

		if (cache[scriptId].webhook) {
			axios.post(cache[scriptId].webhook, {
				embeds: [
					{
						title: "Burned script",
						description: `Script (\`${scriptId}\`) <t:${Math.floor(Date.now() / 1000)}:R> was burned as it's burn time has passed.`,
						color: 16739693,
						footer: {
							text: "Thermite",
							icon_url: "https://github.com/NamiLab/Thermite/blob/main/gitassets/therm2.png?raw=true"
						}
					}
				],
			}).catch((err) => {
				console.warn(`Failed to send webhook: ${err}`);
			});
		}
		delete cache[scriptId];
		console.log(`Script #${scriptId} was auto-purged - Cache size: ${Object.keys(cache).length} items stored`);
	}, burnTime);
	reply.code(200).send({ message: "Script deployed", burnTime: burnTime, scriptId: scriptId });
};
