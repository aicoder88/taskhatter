import React from "react";
import { motion } from "framer-motion";

interface TaskDistributionData {
  active: number;
  waiting: number;
  completed: number;
}

interface TaskDistributionChartProps {
  data: TaskDistributionData;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const TaskDistributionChart: React.FC<TaskDistributionChartProps> = ({
  data,
  size = 60,
  strokeWidth = 6,
  className = "",
}) => {
  const total = data.active + data.waiting + data.completed;
  
  if (total === 0) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div 
          className="rounded-full border-2 border-white/20 flex items-center justify-center text-white/40 text-xs"
          style={{ width: size, height: size }}
        >
          No Tasks
        </div>
      </div>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate percentages and arc lengths
  const activePercent = (data.active / total) * 100;
  const waitingPercent = (data.waiting / total) * 100;
  const completedPercent = (data.completed / total) * 100;
  
  const activeArc = (activePercent / 100) * circumference;
  const waitingArc = (waitingPercent / 100) * circumference;
  const completedArc = (completedPercent / 100) * circumference;
  
  // Colors for each status
  const colors = {
    active: "#10b981", // green-500
    waiting: "#f59e0b", // amber-500
    completed: "#8b5cf6", // purple-500
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Active tasks arc */}
        {data.active > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.active}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${activeArc} ${circumference - activeArc}`}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${activeArc} ${circumference - activeArc}` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 4px ${colors.active}40)`,
            }}
          />
        )}
        
        {/* Waiting tasks arc */}
        {data.waiting > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.waiting}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${waitingArc} ${circumference - waitingArc}`}
            strokeDashoffset={-activeArc}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ 
              strokeDasharray: `${waitingArc} ${circumference - waitingArc}`,
              strokeDashoffset: -activeArc
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 4px ${colors.waiting}40)`,
            }}
          />
        )}
        
        {/* Completed tasks arc */}
        {data.completed > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.completed}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${completedArc} ${circumference - completedArc}`}
            strokeDashoffset={-(activeArc + waitingArc)}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ 
              strokeDasharray: `${completedArc} ${circumference - completedArc}`,
              strokeDashoffset: -(activeArc + waitingArc)
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            style={{
              filter: `drop-shadow(0 0 4px ${colors.completed}40)`,
            }}
          />
        )}
      </svg>
      
      {/* Center text showing total */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-white font-bold text-xs"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {total}
        </motion.span>
      </div>
    </div>
  );
};

export default TaskDistributionChart;