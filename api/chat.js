export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

try {
const { messages, languageName } = req.body;

const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
},
body: JSON.stringify({
model: 'llama3-8b-8192',
max_tokens: 150,
messages: [
{
role: 'system',
content: `You are ChefVoice, a warm patient cooking companion. Guide anyone through cooking any dish from any cuisine. RESPOND IN ${languageName || 'English'} ONLY. MAX 2 short sentences. ONE step at a time. Be encouraging. End with one clear action.`
},
...messages
]
})
});

const data = await response.json();

if (data.error) {
console.error('Groq error:', data.error);
return res.status(500).json({ error: data.error.message });
}

const reply = data.choices?.[0]?.message?.content?.trim() || 'Please try again!';
res.status(200).json({ reply });

} catch (error) {
console.error('Error:', error.message);
res.status(500).json({ error: error.message });
}
}

