import { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { advancedAiService } from "./services/advancedAiService";

export function registerAdvancedAiRoutes(app: Express) {
  // Quiz generation route
  app.post("/api/ai/generate-quiz", isAuthenticated, async (req: any, res) => {
    try {
      const { text, numberOfQuestions = 5, language = "ar" } = req.body;
      const questions = await advancedAiService.generateQuizQuestions(text, numberOfQuestions, language);
      res.json({ questions });
    } catch (error) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  // Study plan generation
  app.post("/api/ai/study-plan", isAuthenticated, async (req: any, res) => {
    try {
      const { topics, availableHoursPerDay, examDate, language = "ar" } = req.body;
      const plan = await advancedAiService.createStudyPlan(
        topics,
        availableHoursPerDay,
        new Date(examDate),
        language
      );
      res.json(plan);
    } catch (error) {
      console.error("Error creating study plan:", error);
      res.status(500).json({ message: "Failed to create study plan" });
    }
  });

  // Personalized recommendations
  app.post("/api/ai/recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const { studentPerformance, language = "ar" } = req.body;
      const recommendations = await advancedAiService.getPersonalizedRecommendations(
        studentPerformance,
        language
      );
      res.json({ recommendations });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Advanced summarization with key points
  app.post("/api/ai/summarize-advanced", isAuthenticated, async (req: any, res) => {
    try {
      const { text, language = "ar" } = req.body;
      const result = await advancedAiService.summarizeWithKeyPoints(text, language);
      res.json(result);
    } catch (error) {
      console.error("Error summarizing text:", error);
      res.status(500).json({ message: "Failed to summarize text" });
    }
  });

  // Answer student questions with context
  app.post("/api/ai/answer-question", isAuthenticated, async (req: any, res) => {
    try {
      const { question, context, language = "ar" } = req.body;
      const answer = await advancedAiService.answerStudentQuestion(question, context, language);
      res.json({ answer });
    } catch (error) {
      console.error("Error answering question:", error);
      res.status(500).json({ message: "Failed to answer question" });
    }
  });

  // Evaluate student written work
  app.post("/api/ai/evaluate-work", isAuthenticated, async (req: any, res) => {
    try {
      const { text, rubric, language = "ar" } = req.body;
      const evaluation = await advancedAiService.evaluateWrittenWork(text, rubric, language);
      res.json(evaluation);
    } catch (error) {
      console.error("Error evaluating work:", error);
      res.status(500).json({ message: "Failed to evaluate work" });
    }
  });
}

