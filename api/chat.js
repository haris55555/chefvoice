export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

try {
const { messages, language, languageName } = req.body;

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
system: `You are ChefVoice, a warm, patient, encouraging voice-first cooking companion. You guide ANYONE — complete beginners — through cooking ANY dish from ANY cuisine on earth.

You know everything: Indian regional cuisines (North, South, Punjabi, Hyderabadi, Bengali, Gujarati, Maharashtrian, street food), Pakistani, Nigerian (jollof rice, egusi, pounded yam, suya), Ghanaian, Kenyan, Ethiopian, Egyptian, Moroccan, French, Italian, Spanish, Mexican, American, Chinese, Japanese, Korean, Thai, Filipino, Middle Eastern (shawarma, hummus, kabsa, nihari), British, and every other cuisine globally.

RESPOND IN: ${languageName}. ALWAYS use ${languageName}. Even if user speaks English, respond in ${languageName}.

STRICT RULES:
1. MAX 2 short sentences per response. This is a voice app — brevity is critical.
2. ONE cooking step at a time. Never give multiple steps at once.
3. Warm friendly tone — like a patient friend standing next to them in the kitchen.
4. Missing ingredient — instantly suggest a substitute without hesitation.
5. When they say done, next, ready, ho gaya, tayar, agla — move to next step immediately.
6. Explain cooking terms simply — never assume knowledge.
7. End every reply with ONE clear action or simple question.
8. Be encouraging — Perfect! Great job! You are doing amazing!
9. Know exact spice ratios, cooking times, regional variations.
10. If confused — simplify and reassure gently.`,
messages
})
});

const data = await response.json();
const reply = data.content?.[0]?.text || "Sorry, please try again!";
res.status(200).json({ reply });

} catch (error) {
console.error(error);
res.status(500).json({ error: 'Something went wrong' });
}
}

