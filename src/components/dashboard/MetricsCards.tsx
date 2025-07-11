import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  cost: number;
  ratingBump: number;
  status: "active" | "completed" | "waiting";
  complaint?: string;
  sources?: string[];
  inspiration?: string;
  mentions?: number;
}

interface MetricsCardsProps {
  tasks: Task[];
  className?: string;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ tasks, className = "" }) => {
  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const activeTasks = tasks.filter(task => task.status === "active").length;
  const waitingTasks = tasks.filter(task => task.status === "waiting").length;
  
  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
  const completedCost = tasks
    .filter(task => task.status === "completed")
    .reduce((sum, task) => sum + task.cost, 0);
  
  const totalRatingBump = tasks
    .filter(task => task.status === "completed")
    .reduce((sum, task) => sum + task.ratingBump, 0);
  
  // Calculate overdue tasks
  const today = new Date();
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return task.status !== "completed" && dueDate < today;
  }).length;
  
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const metrics = [
    {
      label: "Completion",
      value: `${Math.round(completionRate)}%`,
      subValue: `${completedTasks}/${totalTasks}`,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Total Cost",
      value: `$${totalCost.toLocaleString()}`,
      subValue: `$${completedCost.toLocaleString()} done`,
      icon: DollarSign,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Rating Boost",
      value: `+${totalRatingBump.toFixed(2)}`,
      subValue: "from completed",
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Active",
      value: activeTasks.toString(),
      subValue: `${waitingTasks} waiting`,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  // Add overdue indicator if there are overdue tasks
  if (overdueTasks > 0) {
    metrics.push({
      label: "Overdue",
      value: overdueTasks.toString(),
      subValue: "needs attention",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    });
  }

  return (
    <div className={`flex gap-2 sm:gap-3 ${className}`}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`glass rounded-lg p-2 sm:p-3 min-w-[80px] sm:min-w-[100px] ${metric.bgColor} ${metric.borderColor} border`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${metric.color}`} />
              <span className="text-white/70 text-xs font-medium">
                {metric.label}
              </span>
            </div>
            <div className="space-y-0.5">
              <div className={`font-bold text-sm ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-white/50 text-xs">
                {metric.subValue}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsCards;