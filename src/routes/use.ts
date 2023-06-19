import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
export const method = "GET";
export const name = "use/:id";

export const run = async (request: FastifyRequest, reply: FastifyReply, cache: any) => {
	//@ts-ignore
	const id = request.params?.id;
	if (!id) return reply.code(400).send({ error: "Invalid Script ID" });
	if (request.headers["user-agent"] != "Roblox Corporation") { // TODO: https://www.npmjs.com/package/netmask | https://bgp.he.net/AS22697#_prefixes
		reply.code(403).send({ error: "Only Roblox gameinstances are allowed to use this endpoint" });
		
		if (cache[id].webhook) {
			console.log(`Sending webhook for script #${id}`);
			axios.post(cache[id].webhook, {
				embeds: [
					{
						title: "Alert",
						description: `Something tried to access your script (\`${id}\`) <t:${Math.floor(Date.now() / 1000)}:R>, the script is still accessible.`,
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
		return;
	}
	
	let found = false;
	for (const key in cache) {
		if (key === id) {
			reply.type("application/text").code(200).send(cache[key].script);
			if (cache[key].webhook) {
				console.log(`Sending webhook for script #${id}`);
				axios.post(cache[id].webhook, {
					embeds: [
						{
							title: "Alert",
							description: `Your script (\`${id}\`) was accessed <t:${Math.floor(Date.now() / 1000)}:R> and is now no longer accessible.`,
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

			delete cache[key];
			console.log(`Script #${id} was used up, deleted - Cache size: ${Object.keys(cache).length} items stored`);
			found = true;
			return;
		}
	}
	if (!found) reply.code(404).send({ error: "Script not found" });
};
