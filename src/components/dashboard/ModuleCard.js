import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Clock, BookOpen, CheckCircle, Play } from "lucide-react";
import { getDifficultyColor, formatTime } from "../../utils";

export default function ModuleCard({ module, progress, onStartModule }) {
  const moduleProgress = progress.find((p) => p.module_id === module.id) || {
    completion_status: "not_started",
    progress_percentage: 0,
    time_spent_minutes: 0,
  };

  const getStatusIcon = () => {
    switch (moduleProgress.completion_status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (moduleProgress.completion_status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in_progress":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${getStatusColor()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg font-semibold text-slate-900">
              {module.title}
            </CardTitle>
          </div>
          <Badge className={getDifficultyColor(module.difficulty_level)}>
            {module.difficulty_level}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mt-2">{module.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Time and Progress Info */}
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(module.estimated_time_minutes)}</span>
            </div>
            <span className="font-medium">
              {moduleProgress.progress_percentage}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <Progress
            value={moduleProgress.progress_percentage}
            className="h-2"
          />

          {/* Action Button */}
          <Button
            onClick={() => onStartModule(module.id)}
            className="w-full"
            variant={
              moduleProgress.completion_status === "completed"
                ? "outline"
                : "default"
            }
          >
            {moduleProgress.completion_status === "completed"
              ? "Review Module"
              : moduleProgress.completion_status === "in_progress"
              ? "Continue Learning"
              : "Start Module"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
