// Learning Progress Entity
// This would normally be a class or interface, but for simplicity we'll use a factory function

export const LearningProgress = {
  // Create a new learning progress entry
  create: (moduleId, moduleTitle, category) => ({
    module_id: moduleId,
    module_title: moduleTitle,
    category: category,
    completion_status: "not_started",
    progress_percentage: 0,
    time_spent_minutes: 0,
    last_accessed: null,
    notes: "",
  }),

  // Update progress
  updateProgress: (progress, updates) => ({
    ...progress,
    ...updates,
    last_accessed: new Date().toISOString(),
  }),

  // Mark as completed
  markCompleted: (progress) => ({
    ...progress,
    completion_status: "completed",
    progress_percentage: 100,
    last_accessed: new Date().toISOString(),
  }),

  // Mark as in progress
  markInProgress: (progress) => ({
    ...progress,
    completion_status: "in_progress",
    last_accessed: new Date().toISOString(),
  }),

  // Add time spent
  addTimeSpent: (progress, minutes) => ({
    ...progress,
    time_spent_minutes: (progress.time_spent_minutes || 0) + minutes,
    last_accessed: new Date().toISOString(),
  }),
};

// Sample learning progress data (in a real app, this would come from localStorage or a backend)
export const getInitialLearningProgress = () => [
  // This would be populated from localStorage or API
  // For now, return empty array
];

// Save progress to localStorage
export const saveProgressToStorage = (progress) => {
  try {
    localStorage.setItem("learningProgress", JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
};

// Load progress from localStorage
export const loadProgressFromStorage = () => {
  try {
    const stored = localStorage.getItem("learningProgress");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load progress:", error);
    return [];
  }
};
