import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key",
});

export class AIService {
  async chatWithAssistant(message: string, language: string = "ar"): Promise<string> {
    try {
      const systemPrompt = language === "ar" 
        ? "أنت مساعد ذكي للطلاب في الجامعة الافتراضية السورية. ساعد الطلاب في فهم المواد الدراسية وأجب على أسئلتهم بطريقة واضحة ومفيدة باللغة العربية."
        : "You are an intelligent assistant for students at the Syrian Virtual University. Help students understand their study materials and answer their questions clearly and helpfully in English.";

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "عذراً، لم أتمكن من الإجابة على سؤالك.";
    } catch (error) {
      console.error("Error in AI chat:", error);
      throw new Error("Failed to process AI request");
    }
  }

  async summarizeText(text: string, language: string = "ar"): Promise<string> {
    try {
      const prompt = language === "ar"
        ? `لخص النص التالي بطريقة واضحة ومفيدة باللغة العربية، مع التركيز على النقاط المهمة:\n\n${text}`
        : `Summarize the following text clearly and helpfully in English, focusing on the important points:\n\n${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      return response.choices[0].message.content || "فشل في تلخيص النص";
    } catch (error) {
      console.error("Error summarizing text:", error);
      throw new Error("Failed to summarize text");
    }
  }

  async generateFlashcards(text: string, language: string = "ar"): Promise<Array<{question: string, answer: string}>> {
    try {
      const prompt = language === "ar"
        ? `قم بإنشاء بطاقات دراسية من النص التالي. أنشئ أسئلة وأجوبة باللغة العربية بصيغة JSON مع الحقول "question" و "answer". أنشئ 5-10 بطاقات:\n\n${text}`
        : `Create study flashcards from the following text. Generate questions and answers in English in JSON format with "question" and "answer" fields. Create 5-10 cards:\n\n${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Return only valid JSON array of flashcards with question and answer fields."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.flashcards || [];
    } catch (error) {
      console.error("Error generating flashcards:", error);
      return [];
    }
  }

  async checkPlagiarism(text: string): Promise<{score: number, analysis: string}> {
    try {
      const prompt = `Analyze the following text for potential plagiarism indicators. Provide a plagiarism score from 0-100 (0 being original, 100 being completely plagiarized) and a brief analysis. Respond in JSON format with "score" and "analysis" fields:\n\n${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a plagiarism detection expert. Analyze text for originality indicators and provide a score with analysis in JSON format."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"score": 0, "analysis": "Unable to analyze"}');
      return {
        score: Math.max(0, Math.min(100, result.score)),
        analysis: result.analysis
      };
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      return {
        score: 0,
        analysis: "فشل في تحليل النص للانتحال"
      };
    }
  }
}

export const aiService = new AIService();
