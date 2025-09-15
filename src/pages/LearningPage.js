import React, { useState, useEffect } from "react";
import { LearningProgress } from "../entities/LearningProgress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CheckCircle, Clock, ArrowRight, Target, Map } from "lucide-react";

const LEARNING_PATHS = [
  {
    id: "beginner-path",
    title: "System Design Fundamentals",
    description: "Start your system design journey with core concepts",
    difficulty: "Beginner",
    estimated_weeks: 4,
    modules: [
      "scalability-basics",
      "reliability-availability",
      "performance-metrics",
      "database-fundamentals",
      "caching-strategies",
    ],
  },
  {
    id: "intermediate-path",
    title: "Building Distributed Systems",
    description: "Learn to design and implement distributed architectures",
    difficulty: "Intermediate",
    estimated_weeks: 6,
    modules: [
      "consistency-patterns",
      "load-balancers",
      "message-queues",
      "api-design-patterns",
      "data-modeling-patterns",
      "microservices-architecture",
    ],
  },
  {
    id: "advanced-path",
    title: "Expert System Architect",
    description: "Master complex distributed system concepts and patterns",
    difficulty: "Advanced",
    estimated_weeks: 8,
    modules: [
      "distributed-consensus",
      "cap-theorem",
      "distributed-transactions",
      "system-monitoring",
      "event-driven-architecture",
    ],
  },
  {
    id: "case-studies-path",
    title: "Real-World System Design",
    description: "Apply your knowledge to design real systems",
    difficulty: "Expert",
    estimated_weeks: 10,
    modules: [
      "design-twitter",
      "design-uber",
      "design-netflix",
      "design-whatsapp",
      "design-youtube",
      "design-amazon",
      "design-dropbox",
    ],
  },
];

export default function LearningPathPage() {
  const [learningProgress, setLearningProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setIsLoading(true);
    try {
      const progress = await LearningProgress.list();
      setLearningProgress(progress);
    } catch (error) {
      console.error("Error loading progress:", error);
      setLearningProgress([]);
    }
    setIsLoading(false);
  };

  const getPathProgress = (path) => {
    const completedModules = path.modules.filter((moduleId) => {
      const progress = learningProgress.find((p) => p.module_id === moduleId);
      return progress?.completion_status === "completed";
    }).length;

    return Math.round((completedModules / path.modules.length) * 100);
  };

  const getRecommendedPath = () => {
    const totalCompleted = learningProgress.filter(
      (p) => p.completion_status === "completed"
    ).length;

    if (totalCompleted === 0) return LEARNING_PATHS[0];
    if (totalCompleted < 5) return LEARNING_PATHS[0];
    if (totalCompleted < 10) return LEARNING_PATHS[1];
    if (totalCompleted < 15) return LEARNING_PATHS[2];
    return LEARNING_PATHS[3];
  };

  const recommendedPath = getRecommendedPath();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Map className="w-8 h-8 text-blue-500" />
            Learning Paths
          </h1>
          <p className="text-lg text-slate-600">
            Structured learning journeys to master system design step by step
          </p>
        </div>

        {/* Recommended Path */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-20 -translate-y-20" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">
                RECOMMENDED FOR YOU
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">
              {recommendedPath.title}
            </CardTitle>
            <p className="opacity-90">{recommendedPath.description}</p>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {recommendedPath.modules.length}
                  </p>
                  <p className="text-sm opacity-75">Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {recommendedPath.estimated_weeks}
                  </p>
                  <p className="text-sm opacity-75">Weeks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {getPathProgress(recommendedPath)}%
                  </p>
                  <p className="text-sm opacity-75">Complete</p>
                </div>
              </div>
              <Link to={createPageUrl("Dashboard")}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <Progress
              value={getPathProgress(recommendedPath)}
              className="h-2 bg-white/20"
            />
          </CardContent>
        </Card>

        {/* All Learning Paths */}
        <div className="grid md:grid-cols-2 gap-6">
          {LEARNING_PATHS.map((path) => {
            const progressPercentage = getPathProgress(path);
            const isRecommended = path.id === recommendedPath.id;

            return (
              <Card
                key={path.id}
                className={`shadow-lg border-0 transition-all duration-200 hover:shadow-xl ${
                  isRecommended ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        path.difficulty === "Beginner"
                          ? "secondary"
                          : path.difficulty === "Intermediate"
                          ? "default"
                          : path.difficulty === "Advanced"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {path.difficulty}
                    </Badge>
                    {isRecommended && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{path.title}</CardTitle>
                  <p className="text-slate-600">{path.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {path.estimated_weeks} weeks
                        </span>
                        <span>{path.modules.length} modules</span>
                      </div>
                      <span className="font-medium">
                        {progressPercentage}% complete
                      </span>
                    </div>

                    <Progress value={progressPercentage} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4" />
                        {
                          path.modules.filter((moduleId) => {
                            const progress = learningProgress.find(
                              (p) => p.module_id === moduleId
                            );
                            return progress?.completion_status === "completed";
                          }).length
                        }{" "}
                        / {path.modules.length} completed
                      </div>

                      <Link to={createPageUrl("Dashboard")}>
                        <Button
                          variant={isRecommended ? "default" : "outline"}
                          size="sm"
                        >
                          {progressPercentage > 0 ? "Continue" : "Start Path"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Tips */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              💡 Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Focus on one learning path at a time for better retention
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Practice explaining concepts to reinforce your understanding
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Take notes and document your learning journey</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Apply learned concepts to real-world scenarios and case
                  studies
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
