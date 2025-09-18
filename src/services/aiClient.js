const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function askIntent(offer, lead) {
  const prompt = `
You are a sales intent classifier. Given product/offer details and a prospect, classify the prospect's buying intent as one of: High, Medium, Low.

Product:
Name: ${offer.name}
Value props: ${offer.value_props.join('; ')}
Ideal use cases: ${offer.ideal_use_cases.join('; ')}

Prospect:
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}
Industry: ${lead.industry}
Location: ${lead.location}
LinkedIn bio: ${lead.linkedin_bio}

Instructions:
1) Provide output in JSON only with two fields: "intent" and "explanation".
2) "intent" must be exactly one of: High, Medium, Low.
3) "explanation" should be 1-2 short sentences explaining reasoning (mention role/industry/fit briefly).

Example output:
{"intent":"High","explanation":"..."}
`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.0
  });

  const text = response.choices?.[0]?.message?.content || '';
  try {
    const jsonMatch = text.trim().match(/\{[\s\S]*\}$/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonText);
    const intent = parsed.intent && ['High','Medium','Low'].includes(parsed.intent) ? parsed.intent : 'Low';
    const explanation = parsed.explanation || '';
    return { intent, explanation };
  } catch (err) {
    return { intent: 'Medium', explanation: (text || 'AI response not parseable') };
  }
}

module.exports = { askIntent };
