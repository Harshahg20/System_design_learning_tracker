import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ModuleCard from "./ModuleCard";

const categoryDescriptions = {
  fundamentals: "Master the core concepts and principles of system design",
  components: "Learn about databases, caches, load balancers, and more",
  patterns: "Understand architectural patterns and design approaches",
  advanced: "Dive deep into complex distributed system concepts",
  case_studies: "Analyze real-world system architectures and implementations",
};

const categoryIcons = {
  fundamentals: "🎯",
  components: "🔧",
  patterns: "🏗️",
  advanced: "🚀",
  case_studies: "💡",
};

export default function CategorySection({
  category,
  modules,
  progress,
  onStartModule,
}) {
  const categoryTitle = category
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="mb-12">
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <span className="text-2xl">{categoryIcons[category]}</span>
            {categoryTitle}
          </CardTitle>
          <p className="text-slate-600">{categoryDescriptions[category]}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress}
            onStartModule={onStartModule}
          />
        ))}
      </div>
    </div>
  );
}
