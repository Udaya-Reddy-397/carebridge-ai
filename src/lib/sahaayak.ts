import { ChatMessage } from "@/types";
import { v4 as uuid } from "uuid";

const KNOWLEDGE: { keywords: string[]; answer: string; sources: string[] }[] = [
  {
    keywords: ["blood", "test", "cbc", "hba1c", "lab", "sample"],
    answer:
      "Your care plan asks for a fasting blood test (CBC + HbA1c). Please go to the lab between 8–10 AM without eating or drinking anything except water after midnight. Carry the form given at the clinic. Results usually return within 24–48 hours and will be reviewed by your doctor.",
    sources: ["Patient Care Plan – Type 2 Diabetes", "Lab preparation guidance (clinic handout)"],
  },
  {
    keywords: ["metformin", "medicine", "tablet", "dose", "medication"],
    answer:
      "Metformin is usually taken with or after food to reduce stomach upset. Do not change the dose yourself. If you miss a dose and it is close to the next one, skip the missed dose—do not double up. Contact your care team if nausea or diarrhoea lasts more than two days.",
    sources: ["Approved knowledge base – Oral antidiabetic agents", "Your prescribed care plan"],
  },
  {
    keywords: ["walk", "exercise", "activity", "knee", "pain"],
    answer:
      "A 30-minute brisk walk most days is recommended in your plan. Start slowly if you have been inactive. If knee pain increases or you feel chest discomfort, stop and rest. Note any new symptoms for your next visit. Walking after meals can also help blood sugar control.",
    sources: ["Lifestyle section of your care plan", "WHO physical activity guidance (adapted)"],
  },
  {
    keywords: ["fever", "breathing", "emergency", "help", "urgent", "101"],
    answer:
      "If your temperature goes above 101°F (38.3°C) or you develop breathing difficulty, chest pain, or confusion, seek medical help immediately—call the clinic helpline or go to the nearest emergency department. Do not wait for the next scheduled appointment.",
    sources: ["Seek-help instruction in your care plan", "Clinic urgent-care pathway (rule-based)"],
  },
  {
    keywords: ["follow-up", "visit", "appointment", "review"],
    answer:
      "Your follow-up visit is important so the doctor can review test results and adjust the plan if needed. Bring recent sugar readings (if you track them) and any questions written down. Arrive a little early if paperwork is required.",
    sources: ["Your care plan – Follow-up schedule"],
  },
  {
    keywords: ["hindi", "samajh", "kya", "matlab", "bataye"],
    answer:
      "Main aapke care plan ko simple Hindi mein samjha sakta hoon. Kripya bataiye kaunsi instruction ke baare mein aap jaanna chahte hain—jaise blood test, dawai, ya walk. Main approved sources se hi jawab doonga aur agar sure nahi hoon to aapke doctor ke paas bhejunga.",
    sources: ["Sahaayak bilingual support", "Approved care-plan content"],
  },
];

const FALLBACK =
  "I can only explain instructions that are already in your authorised care plan or the approved knowledge base. I never diagnose, prescribe or change treatment. Please rephrase your question about a specific task, or contact your care team for clinical advice.";

const URGENT_PATTERNS =
  /chest pain|can't breathe|cannot breathe|severe bleeding|unconscious|suicide|kill myself|heart attack/i;

export function generateSahaayakReply(userMessage: string): ChatMessage {
  const text = userMessage.trim();

  // Safety: urgent pathway (rule-based, no improvisation)
  if (URGENT_PATTERNS.test(text)) {
    return {
      id: uuid(),
      role: "assistant",
      content:
        "This sounds potentially urgent. Please seek immediate medical help—call emergency services or go to the nearest hospital. I am not able to provide emergency medical advice. Your safety comes first.",
      sources: ["Rule-based urgent pathway (clinically reviewed)"],
      timestamp: new Date().toISOString(),
    };
  }

  const lower = text.toLowerCase();
  for (const item of KNOWLEDGE) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return {
        id: uuid(),
        role: "assistant",
        content: item.answer,
        sources: item.sources,
        timestamp: new Date().toISOString(),
      };
    }
  }

  return {
    id: uuid(),
    role: "assistant",
    content: FALLBACK,
    sources: ["Sahaayak safety guardrails"],
    timestamp: new Date().toISOString(),
  };
}
