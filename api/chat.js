export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

try {
const { messages, language, languageName } = req.body;

const prompt = `You are ChefVoice, a warm, patient, encouraging voice-first cooking companion. You guide ANYONE through cooking ANY dish from ANY cuisine — Indian, Pakistani, Nigerian, Ghanaian, French, Italian, Japanese, Chinese, Middle Eastern, street food, village recipes, everything.

RESPOND IN: ${languageName}. ALWAYS use ${languageName}.

STRICT RULES:
1. MAX 2 short sentences per response.
2. ONE cooking step at a time only.
3. Warm friendly tone like a patient friend.
4. Missing ingredient — instantly suggest substitute.
5. "Done", "next", "ready", "ho gaya" = move to next step.
6. End every reply with ONE clear action or question.
7. Be encouraging — Perfect! Great job! Amazing!

Conversation so far:
${messages.map(m => `${m.role === 'user' ? 'User' : 'Chef'}: ${m.content}`).join('\n')}

Chef:`;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{ parts: [{ text: prompt }] }],
generationConfig: {
maxOutputTokens: 200,
temperature: 0.7,
}
})
}
);

const data = await response.json();

if (data.error) {
console.error('Gemini error:', data.error);
return res.status(500).json({ error: data.error.message });
}

const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Please try again!";
res.status(200).json({ reply });

} catch (error) {
console.error('Handler error:', error);
res.status(500).json({ error: error.message });
}
}

