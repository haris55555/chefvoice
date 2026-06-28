export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

try {
const { messages, language, languageName } = req.body;

console.log('Messages received:', JSON.stringify(messages));

const response = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'x-api-key': process.env.ANTHROPIC_API_KEY,
'anthropic-version': '2023-06-01'
},
body: JSON.stringify({
model: 'claude-sonnet-4-6',
max_tokens: 200,
system: `You are ChefVoice, a warm cooking companion. Respond in ${languageName || 'English'}. Keep replies to 2 short sentences maximum. Guide cooking step by step.`,
messages: messages
})
});

const data = await response.json();
console.log('Anthropic response:', JSON.stringify(data));

if (data.error) {
console.error('Anthropic error:', data.error);
return res.status(500).json({ error: data.error.message });
}

const reply = data.content?.[0]?.text || "Please try again!";
res.status(200).json({ reply });

} catch (error) {
console.error('Handler error:', error);
res.status(500).json({ error: error.message });
}
}

