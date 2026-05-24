const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function extractVialLabel(base64Image) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            }
          },
          {
            text: `Analyze this peptide vial label image. Extract the following information and return ONLY a JSON object with these fields:
- peptideName: the name of the peptide (e.g. "Tirzepatide", "BPC-157", "Semaglutide")
- peptideMg: the total milligrams of peptide in the vial as a number (e.g. 10, 5, 15)

If you cannot determine a value, set it to null. Return ONLY the JSON object, no other text.
Example response: {"peptideName": "Tirzepatide", "peptideMg": 10}`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 200,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse vial data');

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    peptideName: parsed.peptideName || '',
    peptideMg: parsed.peptideMg || '',
    waterMl: '',
    targetMcg: '',
  };
}

export async function generateProtocol(answers) {
  const prompt = `You are a world-class longevity and wellness AI coach. Generate a highly personalized 30-day health protocol based on the following user data:
Goals: ${answers.goal || 'General wellness'}
Sleep: ${answers.sleep || 'Average'}
Energy: ${answers.energy || 'Average'}
Interested Peptides: ${(answers.peptides || []).join(', ') || 'None specified'}

Return a strict JSON object with this exact structure:
{
  "summary": "A 2-sentence encouraging summary of their path forward.",
  "focusAreas": ["area 1", "area 2", "area 3"],
  "dailyRoutine": [
    { "time": "Morning", "action": "Take..." },
    { "time": "Evening", "action": "Do..." }
  ],
  "safetyNote": "A brief reminder that this is for research and they should consult a doctor."
}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
    })
  });
  
  if (!response.ok) throw new Error('Gemini API error');
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse protocol data');
  return JSON.parse(jsonMatch[0]);
}
