import React from "react";
import { motion } from "framer-motion";
import ProgressGauge from "./ProgressGauge";
import TaskDistributionChart from "./TaskDistributionChart";
import MetricsCards from "./MetricsCards";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  cost: number;
  ratingBump: number;
  status: "active" | "completed" | "waiting";
}

interface DashboardHeaderProps {
  tasks: Task[];
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ tasks, className = "" }) => {
  // Calculate data for visualizations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const activeTasks = tasks.filter(task => task.status === "active").length;
  const waitingTasks = tasks.filter(task => task.status === "waiting").length;
  
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const distributionData = {
    active: activeTasks,
    waiting: waitingTasks,
    completed: completedTasks,
  };

  // Priority breakdown
  const priorityCounts = {
    high: tasks.filter(task => task.priority === "High").length,
    medium: tasks.filter(task => task.priority === "Medium").length,
    low: tasks.filter(task => task.priority === "Low").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-4 border border-white/10 ${className}`}
    >
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
        {/* Left side - Main metrics */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Progress Gauge */}
          <div className="flex flex-col items-center">
            <ProgressGauge percentage={completionPercentage} size={70} />
            <span className="text-white/60 text-xs mt-1 font-medium">Overall</span>
          </div>
          
          {/* Task Distribution Chart */}
          <div className="flex flex-col items-center">
            <TaskDistributionChart data={distributionData} size={60} />
            <span className="text-white/60 text-xs mt-1 font-medium">Distribution</span>
          </div>
          
          {/* Priority Indicators */}
          <div className="flex sm:flex-col gap-2 sm:gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-white/70 text-xs">High: {priorityCounts.high}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-white/70 text-xs">Med: {priorityCounts.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-white/70 text-xs">Low: {priorityCounts.low}</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Metrics Cards */}
        <div className="w-full xl:flex-1 xl:max-w-2xl">
          <MetricsCards tasks={tasks} className="flex-wrap justify-center xl:justify-end" />
        </div>
      </div>
      
      {/* Status Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-white/60 text-xs">Active ({activeTasks})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-white/60 text-xs">Waiting ({waitingTasks})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-white/60 text-xs">Completed ({completedTasks})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;