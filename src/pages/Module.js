import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LearningProgress } from "../entities/LearningProgress";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { createPageUrl } from "../utils";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Target,
  FileText,
  Lightbulb,
} from "lucide-react";

// This would normally come from a backend - static data for demo
const MODULE_CONTENT = {
  "scalability-basics": {
    title: "Scalability Fundamentals",
    description: "Learn the core principles of building scalable systems",
    category: "fundamentals",
    difficulty_level: "Beginner",
    estimated_time_minutes: 45,
    content: {
      overview:
        "Scalability is the capability of a system to handle increased workload by adding resources. This module covers horizontal and vertical scaling strategies.",
      key_concepts: [
        {
          title: "Vertical Scaling (Scale Up)",
          description: "Adding more power (CPU, RAM) to existing machines",
          pros: ["Simple to implement", "No application changes needed"],
          cons: ["Limited by hardware constraints", "Single point of failure"],
        },
        {
          title: "Horizontal Scaling (Scale Out)",
          description: "Adding more machines to the resource pool",
          pros: ["Virtually unlimited scaling", "Better fault tolerance"],
          cons: [
            "More complex application design",
            "Data consistency challenges",
          ],
        },
      ],
      practical_examples: [
        "Netflix uses horizontal scaling to serve millions of users globally",
        "Database sharding distributes data across multiple servers",
        "Load balancers distribute traffic across multiple application servers",
      ],
      quiz_questions: [
        {
          question:
            "What is the main advantage of horizontal scaling over vertical scaling?",
          options: ["Cheaper", "Simpler", "Better fault tolerance", "Faster"],
          correct: 2,
        },
      ],
    },
  },
  // Add more modules as needed...
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [notes, setNotes] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const moduleData = MODULE_CONTENT[moduleId];

  const loadModuleProgress = useCallback(async () => {
    setIsLoading(true);
    try {
      const progressList = await LearningProgress.list();
      const moduleProgress = progressList.find((p) => p.module_id === moduleId);

      if (moduleProgress) {
        setProgress(moduleProgress);
        setNotes(moduleProgress.notes || "");
      } else {
        // Create new progress entry
        const newProgress = await LearningProgress.create({
          module_id: moduleId,
          module_title: moduleData?.title || "Unknown Module",
          category: moduleData?.category || "fundamentals",
          completion_status: "in_progress",
          progress_percentage: 0,
          last_accessed: new Date().toISOString(),
        });
        setProgress(newProgress);
      }
    } catch (error) {
      console.error("Error loading module progress:", error);
    }
    setIsLoading(false);
  }, [moduleId, moduleData]); // Add moduleData to dependencies

  useEffect(() => {
    loadModuleProgress();
  }, [loadModuleProgress]);

  const updateProgress = async (progressPercentage, status = "in_progress") => {
    if (!progress) return;

    try {
      const updatedProgress = await LearningProgress.update(progress.id, {
        progress_percentage: progressPercentage,
        completion_status: status,
        last_accessed: new Date().toISOString(),
        notes: notes,
      });
      setProgress(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleCompleteModule = async () => {
    await updateProgress(100, "completed");
    navigate(createPageUrl("Dashboard"));
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Module Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            The requested module could not be found.
          </p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = progress?.progress_percentage || 0;
  const sections = ["overview", "key_concepts", "practical_examples", "quiz"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="mb-4 bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {moduleData.title}
              </h1>
              <p className="text-slate-600 mb-4">{moduleData.description}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-blue-100 text-blue-700">
                  {moduleData.category.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="outline">{moduleData.difficulty_level}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {moduleData.estimated_time_minutes}min
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white/50 backdrop-blur-sm border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Module Progress
                </CardTitle>
                <span className="text-sm font-bold text-slate-900">
                  {progressPercentage}%
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Module Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  {moduleData.content.overview}
                </p>
              </CardContent>
            </Card>

            {/* Key Concepts */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {moduleData.content.key_concepts.map((concept, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-400 pl-6 py-2"
                  >
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {concept.title}
                    </h4>
                    <p className="text-slate-700 mb-3">{concept.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-700 mb-2">
                          ✅ Pros:
                        </p>
                        <ul className="text-slate-600 space-y-1">
                          {concept.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-red-700 mb-2">
                          ❌ Cons:
                        </p>
                        <ul className="text-slate-600 space-y-1">
                          {concept.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Practical Examples */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Practical Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {moduleData.content.practical_examples.map(
                    (example, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{example}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Quiz */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {moduleData.content.quiz_questions.map(
                  (quiz, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="p-4 bg-slate-50 rounded-lg"
                    >
                      <p className="font-medium text-slate-900 mb-4">
                        {quiz.question}
                      </p>
                      <div className="space-y-2">
                        {quiz.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`quiz-${questionIndex}`}
                              value={optionIndex}
                              checked={
                                quizAnswers[questionIndex] === optionIndex
                              }
                              onChange={() =>
                                handleQuizAnswer(questionIndex, optionIndex)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {quizAnswers[questionIndex] !== undefined && (
                        <div
                          className={`mt-3 p-2 rounded text-sm ${
                            quizAnswers[questionIndex] === quiz.correct
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {quizAnswers[questionIndex] === quiz.correct
                            ? "✅ Correct!"
                            : "❌ Try again"}
                        </div>
                      )}
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  updateProgress(Math.min(100, progressPercentage + 25))
                }
                disabled={progressPercentage >= 100}
                className="bg-white/50 backdrop-blur-sm"
              >
                Update Progress
              </Button>
              <Button
                onClick={handleCompleteModule}
                className="bg-green-600 hover:bg-green-700"
                disabled={progressPercentage >= 100}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Module
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  My Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => updateProgress(progressPercentage)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
