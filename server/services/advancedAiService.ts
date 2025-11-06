import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "default_key",
});

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface StudyPlan {
  title: string;
  duration: number; // in days
  topics: string[];
  dailyTasks: string[];
  estimatedHours: number;
}

export interface PersonalizedRecommendation {
  type: "strength" | "weakness" | "suggestion";
  topic: string;
  description: string;
  resources: string[];
}

export class AdvancedAIService {
  /**
   * Generate quiz questions from study material
   */
  async generateQuizQuestions(
    text: string,
    numberOfQuestions: number = 5,
    language: string = "ar"
  ): Promise<QuizQuestion[]> {
    try {
      const prompt = language === "ar"
        ? `قم بإنشاء ${numberOfQuestions} أسئلة اختبار متنوعة من النص التالي. يجب أن تشمل الأسئلة أنواعاً مختلفة (اختيار من متعدد، صح وخطأ، إجابة قصيرة). 
        
النص:
${text}

أرجع النتيجة كـ JSON بالصيغة التالية:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice|true_false|short_answer|essay",
      "question": "السؤال",
      "options": ["خيار1", "خيار2", "خيار3", "خيار4"],
      "correctAnswer": "الإجابة الصحيحة",
      "explanation": "شرح الإجابة",
      "difficulty": "easy|medium|hard"
    }
  ]
}`
        : `Generate ${numberOfQuestions} diverse quiz questions from the following text. Include different question types (multiple choice, true/false, short answer). 

Text:
${text}

Return the result as JSON in the following format:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice|true_false|short_answer|essay",
      "question": "The question",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "The correct answer",
      "explanation": "Explanation of the answer",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educational content creator. Generate diverse, challenging quiz questions that test deep understanding, not just memorization."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.questions || [];
    } catch (error) {
      console.error("Error generating quiz questions:", error);
      throw new Error("Failed to generate quiz questions");
    }
  }

  /**
   * Create a personalized study plan
   */
  async createStudyPlan(
    topics: string[],
    availableHoursPerDay: number,
    examDate: Date,
    language: string = "ar"
  ): Promise<StudyPlan> {
    try {
      const daysUntilExam = Math.ceil(
        (examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const prompt = language === "ar"
        ? `أنشئ خطة دراسية شخصية لطالب يريد دراسة المواضيع التالية:
${topics.join("\n")}

معلومات الطالب:
- الوقت المتاح يومياً: ${availableHoursPerDay} ساعات
- عدد الأيام حتى الامتحان: ${daysUntilExam} يوم

أرجع النتيجة كـ JSON بالصيغة التالية:
{
  "title": "عنوان الخطة",
  "duration": ${daysUntilExam},
  "topics": ["موضوع1", "موضوع2"],
  "dailyTasks": ["مهمة1", "مهمة2"],
  "estimatedHours": ${availableHoursPerDay * daysUntilExam}
}`
        : `Create a personalized study plan for a student who wants to study the following topics:
${topics.join("\n")}

Student Information:
- Available time per day: ${availableHoursPerDay} hours
- Days until exam: ${daysUntilExam} days

Return the result as JSON in the following format:
{
  "title": "Plan Title",
  "duration": ${daysUntilExam},
  "topics": ["topic1", "topic2"],
  "dailyTasks": ["task1", "task2"],
  "estimatedHours": ${availableHoursPerDay * daysUntilExam}
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert academic advisor. Create realistic, achievable study plans that optimize learning outcomes."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    } catch (error) {
      console.error("Error creating study plan:", error);
      throw new Error("Failed to create study plan");
    }
  }

  /**
   * Provide personalized learning recommendations
   */
  async getPersonalizedRecommendations(
    studentPerformance: { topic: string; score: number; attempts: number }[],
    language: string = "ar"
  ): Promise<PersonalizedRecommendation[]> {
    try {
      const performanceText = studentPerformance
        .map(p => `${p.topic}: ${p.score}% (${p.attempts} محاولات)`)
        .join("\n");

      const prompt = language === "ar"
        ? `بناءً على أداء الطالب التالي:
${performanceText}

قدم توصيات شخصية لتحسين الأداء. أرجع النتيجة كـ JSON:
{
  "recommendations": [
    {
      "type": "strength|weakness|suggestion",
      "topic": "الموضوع",
      "description": "الوصف",
      "resources": ["مورد1", "مورد2"]
    }
  ]
}`
        : `Based on the following student performance:
${performanceText}

Provide personalized recommendations for improvement. Return the result as JSON:
{
  "recommendations": [
    {
      "type": "strength|weakness|suggestion",
      "topic": "Topic",
      "description": "Description",
      "resources": ["resource1", "resource2"]
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educational analyst. Provide insightful, actionable recommendations based on student performance data."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw new Error("Failed to get recommendations");
    }
  }

  /**
   * Enhanced summarization with key points extraction
   */
  async summarizeWithKeyPoints(
    text: string,
    language: string = "ar"
  ): Promise<{ summary: string; keyPoints: string[]; mainIdeas: string[] }> {
    try {
      const prompt = language === "ar"
        ? `قم بتحليل النص التالي وأرجع:
1. ملخص شامل
2. النقاط الرئيسية (5-7 نقاط)
3. الأفكار الرئيسية (3-5 أفكار)

النص:
${text}

أرجع النتيجة كـ JSON:
{
  "summary": "الملخص",
  "keyPoints": ["نقطة1", "نقطة2"],
  "mainIdeas": ["فكرة1", "فكرة2"]
}`
        : `Analyze the following text and return:
1. A comprehensive summary
2. Key points (5-7 points)
3. Main ideas (3-5 ideas)

Text:
${text}

Return the result as JSON:
{
  "summary": "The summary",
  "keyPoints": ["point1", "point2"],
  "mainIdeas": ["idea1", "idea2"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert content analyst. Extract key information and create comprehensive summaries that aid understanding."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    } catch (error) {
      console.error("Error summarizing with key points:", error);
      throw new Error("Failed to summarize text");
    }
  }

  /**
   * Answer student questions with context
   */
  async answerStudentQuestion(
    question: string,
    context: string,
    language: string = "ar"
  ): Promise<string> {
    try {
      const systemPrompt = language === "ar"
        ? "أنت مساعد ذكي متخصص في الإجابة على أسئلة طلاب الجامعة الافتراضية السورية. أجب على الأسئلة بناءً على السياق المقدم بطريقة واضحة وشاملة باللغة العربية."
        : "You are an intelligent assistant specialized in answering questions from Syrian Virtual University students. Answer questions based on the provided context clearly and comprehensively in English.";

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `السياق:\n${context}\n\nالسؤال:\n${question}`
          }
        ],
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "عذراً، لم أتمكن من الإجابة على سؤالك.";
    } catch (error) {
      console.error("Error answering question:", error);
      throw new Error("Failed to answer question");
    }
  }

  /**
   * Evaluate student essay or written work
   */
  async evaluateWrittenWork(
    text: string,
    rubric?: string,
    language: string = "ar"
  ): Promise<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }> {
    try {
      const rubricText = rubric ? `معايير التقييم:\n${rubric}\n\n` : "";

      const prompt = language === "ar"
        ? `${rubricText}قم بتقييم العمل التالي:
${text}

أرجع النتيجة كـ JSON:
{
  "score": 85,
  "feedback": "التقييم العام",
  "strengths": ["نقطة قوة1", "نقطة قوة2"],
  "improvements": ["تحسين1", "تحسين2"]
}`
        : `${rubricText}Evaluate the following work:
${text}

Return the result as JSON:
{
  "score": 85,
  "feedback": "General feedback",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert academic evaluator. Provide constructive, detailed feedback on student work."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    } catch (error) {
      console.error("Error evaluating written work:", error);
      throw new Error("Failed to evaluate work");
    }
  }
}

export const advancedAiService = new AdvancedAIService();

