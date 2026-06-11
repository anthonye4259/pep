const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Fallback plan when API is unavailable
const FALLBACK_PLAN = {
  summary: "Your wellness journey starts with building strong daily habits. Focus on consistent sleep, balanced nutrition, and regular movement to create a foundation for lasting health.",
  focusAreas: ["Sleep Optimization", "Nutrition Balance", "Active Recovery"],
  schedule: [
    { week: "Weeks 1-4", action: "Foundation phase — establish baseline habits", focus: "Focus: sleep hygiene + hydration" },
    { week: "Weeks 5-8", action: "Build phase — increase activity and nutrition focus", focus: "Focus: nutrition optimization + exercise" },
    { week: "Weeks 9-12", action: "Optimization phase — fine-tune your routine", focus: "Focus: stress management + recovery" }
  ],
  inventoryAdvice: "Start each morning with a glass of water and 10 minutes of light stretching. Small habits compound into big results over 12 weeks.",
  safetyNote: "Always consult a qualified healthcare professional before making significant changes to your health or exercise routine."
};

export async function generateProtocol(answers) {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key, using fallback plan');
      return FALLBACK_PLAN;
    }

    const prompt = `You are an expert wellness and health education AI coach. Generate a personalized 12-week wellness optimization plan based on the following user data:
Goals: ${answers.goal || 'General wellness'}
Sleep Quality: ${answers.sleep || 'Average'}
Energy Levels: ${answers.energy || 'Average'}

IMPORTANT: Do NOT mention any specific medications, drugs, or pharmaceutical compounds. Do NOT provide any dosage recommendations. Focus ONLY on lifestyle, nutrition, exercise, sleep hygiene, and general wellness habits.

Return a strict JSON object with this exact structure:
{
  "summary": "A 2-sentence encouraging summary of their wellness path forward.",
  "focusAreas": ["area 1", "area 2", "area 3"],
  "schedule": [
    { "week": "Weeks 1-4", "action": "Foundation phase - establish baseline habits", "focus": "Focus: sleep hygiene + hydration" },
    { "week": "Weeks 5-8", "action": "Build phase - increase intensity", "focus": "Focus: nutrition optimization + exercise" },
    { "week": "Weeks 9-12", "action": "Optimization phase - fine-tune routine", "focus": "Focus: stress management + recovery" }
  ],
  "inventoryAdvice": "A brief wellness tip related to their goals.",
  "safetyNote": "A brief reminder to consult healthcare professionals before making significant changes to health routines."
}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
      })
    });
    
    if (!response.ok) {
      console.warn('Gemini API error, using fallback plan');
      return FALLBACK_PLAN;
    }
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not parse Gemini response, using fallback plan');
      return FALLBACK_PLAN;
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn('generateProtocol failed, using fallback plan:', err);
    return FALLBACK_PLAN;
  }
}
