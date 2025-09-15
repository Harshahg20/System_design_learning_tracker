import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen, CheckCircle, Clock, Target } from "lucide-react";

export default function StatsOverview({ learningProgress }) {
  const totalModules = 25; // Total available modules
  const completedModules = learningProgress.filter(
    (p) => p.completion_status === "completed"
  ).length;
  const inProgressModules = learningProgress.filter(
    (p) => p.completion_status === "in_progress"
  ).length;
  const totalTimeSpent = learningProgress.reduce(
    (sum, p) => sum + (p.time_spent_minutes || 0),
    0
  );

  const stats = [
    {
      title: "Total Modules",
      value: totalModules,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Completed",
      value: completedModules,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "In Progress",
      value: inProgressModules,
      icon: Target,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
    {
      title: "Time Spent",
      value: `${Math.round(totalTimeSpent / 60)}h`,
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden border-0 shadow-lg"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-60`}
          />
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-slate-900">
              {stat.value}
            </div>
            <div className="w-full bg-white/50 rounded-full h-1 mt-3">
              <div
                className={`bg-gradient-to-r ${stat.color} h-1 rounded-full transition-all duration-500`}
                style={{
                  width:
                    stat.title === "Completed"
                      ? `${(completedModules / totalModules) * 100}%`
                      : "100%",
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
