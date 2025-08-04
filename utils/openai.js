const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateResponse = async (message, context = "") => {
  const prompt = `User asked: "${message}"\nHere is relevant data:\n${context}\n\nGive helpful and relevant answer.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an assistant who answers based on given data context." },
      { role: "user", content: prompt }
    ]
  });

  return completion.choices[0].message.content.trim();
};

// Very basic intent detector (optional)
exports.detectIntent = async (message) => {
  if (!message || typeof message !== "string") return "general";

  const lower = message.toLowerCase();

  if (lower.includes("schedule") || lower.includes("kaam") || lower.includes("task") || lower.includes("job details")) return "schedule";
  if (lower.includes("material required") || lower.includes("lagega")) return "task_material";
  if (lower.includes("lost item") || lower.includes("missing items") || lower.includes("item material") || lower.includes("lost items")) return "material_lost";
  if (lower.includes("working hours") || lower.includes("work time") || lower.includes("total time") || lower.includes("total working hours")) return "working_hours";

  return "general";
};

