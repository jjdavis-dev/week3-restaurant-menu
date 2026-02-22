export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		const cors = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: cors });
		}

		if (request.method === 'POST' && url.pathname === '/api/chat') {
			const { systemPrompt, messages } = await request.json();

			// Gemini expects "user" and "model" roles
			const contents = [
				{ role: 'user', parts: [{ text: systemPrompt }] },
				...(messages || []).map((m) => ({
					role: m.role === 'assistant' ? 'model' : 'user',
					parts: [{ text: m.content }],
				})),
			];

			const model = 'gemini-flash-latest';

			const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + env.GEMINI_API_KEY;

			const geminiResponse = await fetch(geminiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contents }),
			});

			if (!geminiResponse.ok) {
				return new Response(await geminiResponse.text(), {
					status: 500,
					headers: cors,
				});
			}

			const data = await geminiResponse.json();

			const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry — I couldn't generate a response.";

			return new Response(JSON.stringify({ reply }), {
				headers: { 'Content-Type': 'application/json', ...cors },
			});
		}

		return new Response('Not Found', { status: 404, headers: cors });
	},
};
