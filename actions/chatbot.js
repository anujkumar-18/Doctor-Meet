"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini if API key is provided
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Fallback rule-based medical assistant responses (incase API key is missing)
const offlineResponses = [
  {
    keywords: ["fever", "bukar", "b बुखार", "temperature", "body pain", "badan dard", "body ache"],
    title: "Fever & General Body Pain (बुखार और बदन दर्द)",
    medicine: "Paracetamol (500mg or 650mg) every 6 hours as needed (e.g., Crocin, Dolo).",
    remedies: [
      "Drink lots of fluids (Water, coconut water, juice) to avoid dehydration.",
      "Get plenty of rest so your body can heal.",
      "Apply cool damp cloth on forehead if temperature is high.",
      "Avoid wearing heavy blankets or close-fitting clothes."
    ]
  },
  {
    keywords: ["cough", "cold", "sardi", "khasi", "flu", "coughing", "khansi", "runny nose", "sneezing", "जुकाम", "खांसी"],
    title: "Cough & Cold (सर्दी और खांसी)",
    medicine: "Cetirizine (10mg) once daily at night for runny nose/sneezing. For cough, general Ayurvedic or over-the-counter cough syrups (e.g., Honitus, Koflet, Alex).",
    remedies: [
      "Drink warm water or herbal herbal ginger-honey tea.",
      "Perform warm water gargles with a pinch of salt 3-4 times a day.",
      "Inhale steam to clear nasal passages.",
      "Avoid cold beverages, ice creams, and highly oily foods."
    ]
  },
  {
    keywords: ["headache", "sir dard", "migraine", "head pain", "sir me dard"],
    title: "Headache / Migraine (सिरदर्द)",
    medicine: "Ibuprofen (200mg/400mg) or Paracetamol (500mg/650mg) after food.",
    remedies: [
      "Rest in a quiet, dark room with your eyes closed.",
      "Drink cup of green tea or weak coffee, or drink a glass of water (dehydration can trigger headaches).",
      "Gently massage your temples with peppermint or eucalyptus oil.",
      "Apply cold compress or warm compress to forehead."
    ]
  },
  {
    keywords: ["stomach", "acidity", "gas", "pet dard", "pet kharab", "diarrhea", "constipation", "indigestion", "acidity", "vomit"],
    title: "Stomach Ache, Acidity & Indigestion (पेट दर्द और अपच)",
    medicine: "For acidity/gas: Gelusil syrup (2 spoonfuls) or Antacid tablet (e.g., Pantoprazole/Digene). For diarrhea/loose motions: ORS (Oral Rehydration Salts) solution continuously, plus Loperamide.",
    remedies: [
      "Eat light food like khichdi (rice-lentil porridge), oats, curd, banana.",
      "Drink plenty of water mixed with ORS or coconut water.",
      "Avoid milk products, spicy, fried, or junk food.",
      "For gas, drinking warm water with a pinch of hing (asafoetida) or fennel seeds tea helps."
    ]
  },
  {
    keywords: ["rash", "itch", "allergy", "skin", "khujli", "redness"],
    title: "Skin Rash & Allergies (त्वचा की खुजली और एलर्जी)",
    medicine: "Cetirizine (10mg) for itching. Calamine lotion (e.g., Lactocalamine) applied locally.",
    remedies: [
      "Do NOT scratch the area as it can lead to infections.",
      "Wash the area with cool water and mild, soap-free cleanser.",
      "Wear loose cotton clothes.",
      "Avoid cosmetic products or harsh chemicals on the affected skin."
    ]
  },
  {
    keywords: ["weakness", "tired", "thakan", "kamjori", "fatigue", "dizziness"],
    title: "Weakness & Fatigue (कमजोरी और थकान)",
    medicine: "ORS (Oral Rehydration Salts) or Electral powder to maintain electrolyte level, coupled with Multivitamin supplements.",
    remedies: [
      "Ensure 7-8 hours of sound sleep.",
      "Focus on iron-rich and protein-rich food (green leafy vegetables, fruits, eggs, lentils).",
      "Stay hydrated throughout the day.",
      "Avoid heavy physical exertion until you feel better."
    ]
  }
];

export async function askSmartChatbot(userInput) {
  if (!userInput || !userInput.trim()) {
    return {
      reply: "Please type a question or describe your symptoms so I can offer advice.",
      isAI: false
    };
  }

  const query = userInput.toLowerCase().trim();

  // If Gemini API Key is available, use it!
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are "Doctor Meet AI Assistant", a smart medical chatbot that helps patients with their common/normal medical issues.
        The user has asked: "${userInput}"

        Follow these strict guidelines for your answer:
        1. Keep the response sweet, professional, and easy to read. Use formatting like bullet points or bold text.
        2. Answer in the same language the user asked. If they asked in Hinglish/Hindi, respond in Hindi/Hinglish (or easy mix of Hindi-English). If they asked in English, answer in English.
        3. For common/normal ailments (like minor cold, flu, fever, headache, stomach acidity, joint pain, rash), suggest general over-the-counter (OTC) medicines (like Paracetamol, Ibuprofen, Cetirizine, ORS, Antacids) and home remedies (diet changes, steam, rest, drinking warm water).
        4. CRITICAL: Add a clear warning/disclaimer at the end of your response stating that this is an AI advisory and NOT a doctor's prescription. Recommend booking a consultation with one of the registered doctors on Doctors Meet for a proper prescription.
        5. NEVER suggest high-risk prescription medicines like strong antibiotics, narcotics, specialized steroids, or heart/diabetic drugs without doctor consultation. Suggest general/OTC/first-aid level solutions.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      return {
        reply: text,
        isAI: true
      };
    } catch (error) {
      console.error("Gemini API Error, falling back to rule-based engine:", error);
      // Fallback is handled below
    }
  }

  // Fallback to Offline Rules Engine
  let responseObj = null;
  for (const item of offlineResponses) {
    const matched = item.keywords.some(keyword => query.includes(keyword));
    if (matched) {
      responseObj = item;
      break;
    }
  }

  if (responseObj) {
    const remediesStr = responseObj.remedies.map(r => `* ${r}`).join("\n");
    const replyText = `**${responseObj.title}**\n\nHere is some general advice:\n\n**Common General medicine(s):**\n${responseObj.medicine}\n\n**Home Remedies:**\n${remediesStr}\n\n⚠️ *Disclaimer: I am running in Offline Mode. This information is meant for general guidance only and is not a medical prescription. Please consult a qualified doctor on Doctors Meet for professional diagnosis.*`;
    return {
      reply: replyText,
      isAI: false
    };
  }

  // Generic fallback if no keyword matches
  const generalReply = `Hello! I am Doctors Meet AI assistant. I can give advice on normal problems like Fever, Cough, cold, Acid Reflux, Stomach pain, Headaches, Skin allergies, etc.

It seems I couldn't match your specific question. Here is general advice:
* Keep yourself well hydrated.
* Complete your sleep and rest.
* Eat fresh fruits, light diet, and avoid junk/spicy foods.
* ⚠️ **Consult a Doctor:** please book an appointment with our specialist doctors on Doctors Meet for proper diagnosis and legal medical prescription.

Try asking about specific symptoms like **"Mujhe sardi aur bukhar hai"** or **"how to treat stomach acid?"**.`;

  return {
    reply: generalReply,
    isAI: false
  };
}
