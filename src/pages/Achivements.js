import React, { useState, useEffect } from "react";
import { LearningProgress } from "../entities/LearningProgress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Award,
  Star,
  Target,
  Flame,
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react";

const ACHIEVEMENTS = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first learning module",
    icon: BookOpen,
    condition: (progress) =>
      progress.filter((p) => p.completion_status === "completed").length >= 1,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "fundamentals-master",
    title: "Fundamentals Master",
    description: "Complete all fundamental modules",
    icon: Target,
    condition: (progress) => {
      const fundamentalsCompleted = progress.filter(
        (p) =>
          p.category === "fundamentals" && p.completion_status === "completed"
      ).length;
      return fundamentalsCompleted >= 4;
    },
    color: "from-green-500 to-green-600",
  },
  {
    id: "components-expert",
    title: "Components Expert",
    description: "Master all system components",
    icon: CheckCircle,
    condition: (progress) => {
      const componentsCompleted = progress.filter(
        (p) =>
          p.category === "components" && p.completion_status === "completed"
      ).length;
      return componentsCompleted >= 5;
    },
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "pattern-pro",
    title: "Pattern Pro",
    description: "Learn all architectural patterns",
    icon: Star,
    condition: (progress) => {
      const patternsCompleted = progress.filter(
        (p) => p.category === "patterns" && p.completion_status === "completed"
      ).length;
      return patternsCompleted >= 4;
    },
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "advanced-architect",
    title: "Advanced Architect",
    description: "Complete all advanced topics",
    icon: Trophy,
    condition: (progress) => {
      const advancedCompleted = progress.filter(
        (p) => p.category === "advanced" && p.completion_status === "completed"
      ).length;
      return advancedCompleted >= 4;
    },
    color: "from-red-500 to-red-600",
  },
  {
    id: "case-study-champion",
    title: "Case Study Champion",
    description: "Solve all real-world system design cases",
    icon: Award,
    condition: (progress) => {
      const caseStudiesCompleted = progress.filter(
        (p) =>
          p.category === "case_studies" && p.completion_status === "completed"
      ).length;
      return caseStudiesCompleted >= 7;
    },
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: "speed-learner",
    title: "Speed Learner",
    description: "Complete 5 modules in one week",
    icon: Flame,
    condition: (progress) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentCompletions = progress.filter(
        (p) =>
          p.completion_status === "completed" &&
          new Date(p.updated_date) >= oneWeekAgo
      ).length;
      return recentCompletions >= 5;
    },
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "completionist",
    title: "System Design Master",
    description: "Complete all learning modules",
    icon: Trophy,
    condition: (progress) =>
      progress.filter((p) => p.completion_status === "completed").length >= 25,
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function AchievementsPage() {
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

  const getOverallStats = () => {
    const totalCompleted = learningProgress.filter(
      (p) => p.completion_status === "completed"
    ).length;
    const totalTimeSpent = learningProgress.reduce(
      (sum, p) => sum + (p.time_spent_minutes || 0),
      0
    );
    const achievementsUnlocked = ACHIEVEMENTS.filter((achievement) =>
      achievement.condition(learningProgress)
    ).length;

    return {
      modulesCompleted: totalCompleted,
      hoursSpent: Math.round(totalTimeSpent / 60),
      achievementsUnlocked,
      overallProgress: Math.round((totalCompleted / 25) * 100),
    };
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Achievements
          </h1>
          <p className="text-lg text-slate-600">
            Track your learning milestones and unlock achievements
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stats.modulesCompleted}
                </div>
                <div className="text-sm opacity-90">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stats.hoursSpent}
                </div>
                <div className="text-sm opacity-90">Hours Spent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stats.achievementsUnlocked}
                </div>
                <div className="text-sm opacity-90">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {stats.overallProgress}%
                </div>
                <div className="text-sm opacity-90">Overall Progress</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>{stats.overallProgress}%</span>
              </div>
              <Progress
                value={stats.overallProgress}
                className="h-3 bg-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = achievement.condition(learningProgress);

            return (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden border-0 shadow-lg transition-all duration-300 ${
                  isUnlocked ? "shadow-xl" : "opacity-60"
                }`}
              >
                {isUnlocked && (
                  <div
                    className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${achievement.color} transform rotate-12 translate-x-4 -translate-y-4`}
                  />
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-xl ${
                        isUnlocked
                          ? `bg-gradient-to-r ${achievement.color}`
                          : "bg-gray-200"
                      }`}
                    >
                      <achievement.icon
                        className={`w-6 h-6 ${
                          isUnlocked ? "text-white" : "text-gray-500"
                        }`}
                      />
                    </div>
                    {isUnlocked && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✅ Unlocked
                      </Badge>
                    )}
                  </div>
                  <CardTitle
                    className={`text-lg ${
                      isUnlocked ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {achievement.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p
                    className={`text-sm ${
                      isUnlocked ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {achievement.description}
                  </p>

                  {!isUnlocked && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Achievement locked - keep learning!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Motivational Section */}
        {stats.achievementsUnlocked < ACHIEVEMENTS.length && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                🚀 Keep Going!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                You've unlocked {stats.achievementsUnlocked} out of{" "}
                {ACHIEVEMENTS.length} achievements. Continue learning to unlock
                more!
              </p>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600">
                  Next milestone: Complete{" "}
                  {Math.ceil((25 - stats.modulesCompleted) / 5) * 5} more
                  modules
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {stats.achievementsUnlocked === ACHIEVEMENTS.length && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                🎉 Congratulations!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Amazing! You've unlocked all achievements and mastered system
                design. You're now ready to tackle any system design challenge!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
