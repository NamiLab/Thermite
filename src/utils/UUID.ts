export async function generateRandom(size?: number) {
	if (!size) size = 100;
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < size; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}
