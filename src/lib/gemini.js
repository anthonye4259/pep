import { freeAI } from './freeAI';

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

const PROTOCOL_SCHEMA = {
  properties: {
    summary: { type: "STRING" },
    focusAreas: { type: "ARRAY", items: { type: "STRING" } },
    schedule: { 
      type: "ARRAY", 
      items: { 
        type: "OBJECT",
        properties: {
          week: { type: "STRING" },
          action: { type: "STRING" },
          focus: { type: "STRING" }
        }
      }
    },
    inventoryAdvice: { type: "STRING" },
    safetyNote: { type: "STRING" }
  },
  required: ["summary", "focusAreas", "schedule", "inventoryAdvice", "safetyNote"]
};

export async function generateProtocol(answers) {
  const prompt = `You are an expert wellness and health education AI coach. Generate a personalized 12-week wellness optimization plan based on the following user data:
Goals: ${answers.goal || 'General wellness'}
Sleep Quality: ${answers.sleep || 'Average'}
Energy Levels: ${answers.energy || 'Average'}

IMPORTANT: Do NOT mention any specific medications, drugs, or pharmaceutical compounds. Do NOT provide any dosage recommendations. Focus ONLY on lifestyle, nutrition, exercise, sleep hygiene, and general wellness habits.`;

  try {
    const result = await freeAI(prompt, { json: true, schema: PROTOCOL_SCHEMA });
    return result.data;
  } catch (err) {
    console.warn('generateProtocol (all free models failed), using fallback plan:', err);
    return FALLBACK_PLAN;
  }
}
