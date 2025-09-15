// Utility functions for the application

export const createPageUrl = (pageName) => {
  const pageMap = {
    Dashboard: "/",
    LearningPath: "/learning",
    Achievements: "/achievements",
    Module: "/module",
  };

  return pageMap[pageName] || "/";
};

export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };
  return colors[difficulty] || "bg-gray-100 text-gray-800";
};

export const getCategoryIcon = (category) => {
  const icons = {
    fundamentals: "🎯",
    components: "🔧",
    patterns: "🏗️",
    advanced: "🚀",
    case_studies: "💡",
  };
  return icons[category] || "📚";
};
