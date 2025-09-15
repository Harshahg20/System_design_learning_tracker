import React, { useState, useEffect } from "react";
import { LearningProgress } from "../entities/LearningProgress";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";

import StatsOverview from "../components/dashboard/StatsOverview";
import CategorySection from "../components/dashboard/CategorySection";

// Static module data - in a real app this would come from a backend
const LEARNING_MODULES = [
  // Fundamentals
  {
    id: "scalability-basics",
    title: "Scalability Fundamentals",
    description:
      "Learn the core principles of building scalable systems, including horizontal vs vertical scaling, load distribution, and capacity planning.",
    category: "fundamentals",
    difficulty_level: "Beginner",
    estimated_time_minutes: 45,
  },
  {
    id: "reliability-availability",
    title: "Reliability & Availability",
    description:
      "Understand how to design systems for high availability, fault tolerance, and disaster recovery.",
    category: "fundamentals",
    difficulty_level: "Beginner",
    estimated_time_minutes: 60,
  },
  {
    id: "consistency-patterns",
    title: "Consistency Patterns",
    description:
      "Explore different consistency models: strong, eventual, weak consistency and their trade-offs.",
    category: "fundamentals",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 50,
  },
  {
    id: "performance-metrics",
    title: "Performance & Metrics",
    description:
      "Learn about latency, throughput, response time, and how to measure system performance.",
    category: "fundamentals",
    difficulty_level: "Beginner",
    estimated_time_minutes: 40,
  },

  // Components
  {
    id: "database-fundamentals",
    title: "Database Design",
    description:
      "SQL vs NoSQL, ACID properties, database sharding, replication, and choosing the right database.",
    category: "components",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 75,
  },
  {
    id: "caching-strategies",
    title: "Caching Systems",
    description:
      "Learn caching patterns, cache eviction policies, distributed caching with Redis and Memcached.",
    category: "components",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 55,
  },
  {
    id: "load-balancers",
    title: "Load Balancing",
    description:
      "Types of load balancers, algorithms, health checks, and implementing high availability.",
    category: "components",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 50,
  },
  {
    id: "message-queues",
    title: "Message Queues & Pub/Sub",
    description:
      "Asynchronous communication, message brokers, Apache Kafka, RabbitMQ, and event streaming.",
    category: "components",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 65,
  },
  {
    id: "cdn-content-delivery",
    title: "Content Delivery Networks",
    description:
      "CDN architecture, edge servers, content caching, and global content distribution strategies.",
    category: "components",
    difficulty_level: "Beginner",
    estimated_time_minutes: 35,
  },

  // Patterns
  {
    id: "microservices-architecture",
    title: "Microservices Architecture",
    description:
      "Design principles, service decomposition, inter-service communication, and microservices challenges.",
    category: "patterns",
    difficulty_level: "Advanced",
    estimated_time_minutes: 90,
  },
  {
    id: "event-driven-architecture",
    title: "Event-Driven Architecture",
    description:
      "Event sourcing, CQRS, saga patterns, and building reactive systems.",
    category: "patterns",
    difficulty_level: "Advanced",
    estimated_time_minutes: 80,
  },
  {
    id: "api-design-patterns",
    title: "API Design Patterns",
    description:
      "REST vs GraphQL, API versioning, rate limiting, authentication, and API gateway patterns.",
    category: "patterns",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 60,
  },
  {
    id: "data-modeling-patterns",
    title: "Data Modeling Patterns",
    description:
      "Normalized vs denormalized data, data warehousing, ETL pipelines, and schema design.",
    category: "patterns",
    difficulty_level: "Intermediate",
    estimated_time_minutes: 70,
  },

  // Advanced
  {
    id: "distributed-consensus",
    title: "Distributed Consensus",
    description:
      "Raft, Paxos algorithms, Byzantine fault tolerance, and achieving consensus in distributed systems.",
    category: "advanced",
    difficulty_level: "Expert",
    estimated_time_minutes: 120,
  },
  {
    id: "cap-theorem",
    title: "CAP Theorem Deep Dive",
    description:
      "Consistency, Availability, Partition tolerance trade-offs with real-world examples and implications.",
    category: "advanced",
    difficulty_level: "Advanced",
    estimated_time_minutes: 75,
  },
  {
    id: "distributed-transactions",
    title: "Distributed Transactions",
    description:
      "Two-phase commit, saga pattern, eventual consistency, and handling transactions across services.",
    category: "advanced",
    difficulty_level: "Expert",
    estimated_time_minutes: 100,
  },
  {
    id: "system-monitoring",
    title: "Monitoring & Observability",
    description:
      "Metrics, logging, tracing, alerting systems, and building observable distributed systems.",
    category: "advanced",
    difficulty_level: "Advanced",
    estimated_time_minutes: 85,
  },

  // Case Studies
  {
    id: "design-twitter",
    title: "Design Twitter",
    description:
      "Complete system design case study: timeline generation, user relationships, and scaling strategies.",
    category: "case_studies",
    difficulty_level: "Advanced",
    estimated_time_minutes: 150,
  },
  {
    id: "design-uber",
    title: "Design Uber",
    description:
      "Location-based services, real-time matching, GPS tracking, and handling millions of rides.",
    category: "case_studies",
    difficulty_level: "Advanced",
    estimated_time_minutes: 140,
  },
  {
    id: "design-netflix",
    title: "Design Netflix",
    description:
      "Video streaming architecture, content delivery, recommendation systems, and global scaling.",
    category: "case_studies",
    difficulty_level: "Advanced",
    estimated_time_minutes: 135,
  },
  {
    id: "design-whatsapp",
    title: "Design WhatsApp",
    description:
      "Real-time messaging, end-to-end encryption, presence indicators, and handling billions of messages.",
    category: "case_studies",
    difficulty_level: "Advanced",
    estimated_time_minutes: 130,
  },
  {
    id: "design-youtube",
    title: "Design YouTube",
    description:
      "Video upload pipeline, transcoding, storage optimization, and serving billions of video views.",
    category: "case_studies",
    difficulty_level: "Expert",
    estimated_time_minutes: 160,
  },
  {
    id: "design-amazon",
    title: "Design Amazon E-commerce",
    description:
      "Product catalog, inventory management, order processing, payment systems, and recommendation engine.",
    category: "case_studies",
    difficulty_level: "Expert",
    estimated_time_minutes: 145,
  },
  {
    id: "design-dropbox",
    title: "Design Dropbox",
    description:
      "File synchronization, conflict resolution, delta sync, and distributed file storage systems.",
    category: "case_studies",
    difficulty_level: "Advanced",
    estimated_time_minutes: 125,
  },
];

export default function Dashboard() {
  const [learningProgress, setLearningProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const handleStartModule = async (module) => {
    const existingProgress = learningProgress.find(
      (p) => p.module_id === module.id
    );

    if (!existingProgress) {
      await LearningProgress.create({
        module_id: module.id,
        module_title: module.title,
        category: module.category,
        completion_status: "in_progress",
        progress_percentage: 0,
        last_accessed: new Date().toISOString(),
      });
      loadProgress();
    }
  };

  const filteredModules = LEARNING_MODULES.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "fundamentals",
    "components",
    "patterns",
    "advanced",
    "case_studies",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            System Design Learning Hub
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Master system design from fundamentals to advanced topics with
            interactive learning modules
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-slate-200"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="bg-white/50 backdrop-blur-sm"
              >
                All Topics
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  {category
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview learningProgress={learningProgress} />

        {/* Learning Modules by Category */}
        {selectedCategory === "all" ? (
          categories.map((category) => {
            const categoryModules = filteredModules.filter(
              (m) => m.category === category
            );
            if (categoryModules.length === 0) return null;

            return (
              <CategorySection
                key={category}
                category={category}
                modules={categoryModules}
                progress={learningProgress}
                onStartModule={handleStartModule}
              />
            );
          })
        ) : (
          <CategorySection
            category={selectedCategory}
            modules={filteredModules}
            progress={learningProgress}
            onStartModule={handleStartModule}
          />
        )}

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No modules found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
