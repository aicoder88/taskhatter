import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import TaskSidebar from "./TaskSidebar";
import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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

interface TaskBoardProps {
  tasks?: Task[];
  showCompleted?: boolean;
  onAddTask?: () => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
}

const TaskBoard = ({
  tasks = [],
  showCompleted = false,
  onAddTask = () => {},
  onUpdateTask = () => {},
  onDeleteTask = () => {},
  onDuplicateTask = () => {},
}: TaskBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const activeTasks = tasks.filter((task) => task.status === "active");
  const waitingTasks = tasks.filter((task) => task.status === "waiting");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleDragStart = (taskId: string) => {
    setDraggingTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetStatus: "active" | "completed" | "waiting",
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && taskId !== draggingTask) return;

    if (draggingTask) {
      const task = tasks.find((t) => t.id === draggingTask);
      if (task && task.status !== targetStatus) {
        onUpdateTask({ ...task, status: targetStatus });
      }
    }
    setDraggingTask(null);
    setDragOverColumn(null);
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleTaskStatusChange = (
    taskId: string,
    status: "active" | "completed" | "waiting",
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, status });
    }
  };

  const handleCloseSidebar = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setSelectedTask(null);
  };

  return (
    <div className="flex flex-col h-full glass rounded-xl p-6 overflow-hidden bg-black/20 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500 rounded-full blur-xl"></div>
      </div>
      <div className="flex flex-1 gap-4 overflow-hidden relative z-10">
        {/* Active Tasks Column */}
        <motion.div
          className={`flex-1 glass rounded-xl p-4 overflow-y-auto transition-all duration-150 ${
            dragOverColumn === "active" ? "drag-over" : ""
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          onDragOver={(e) => handleDragOver(e, "active")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "active")}
        >
          <h2 className="text-xl font-bold text-white/95 mb-6 sticky top-0 glass p-3 rounded-lg z-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            🚀 Active Tasks
            <span className="ml-2 text-sm font-normal text-white/60">
              ({activeTasks.length})
            </span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {activeTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  <TaskCard
                    {...task}
                    onClick={() => handleTaskClick(task.id)}
                    onEdit={() => handleTaskClick(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    onDuplicate={() => onDuplicateTask(task.id)}
                    onStatusChange={(status) =>
                      handleTaskStatusChange(task.id, status)
                    }
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {activeTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass"
              >
                <div className="text-lg font-medium mb-2">No active tasks</div>
                <div className="text-sm">
                  Drag completed tasks here or add new ones
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Waiting Tasks Column */}
        <motion.div
          className={`flex-1 glass rounded-xl p-4 overflow-y-auto transition-all duration-150 ${
            dragOverColumn === "waiting" ? "drag-over" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          onDragOver={(e) => handleDragOver(e, "waiting")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "waiting")}
        >
          <h2 className="text-xl font-bold text-white/95 mb-6 sticky top-0 glass p-3 rounded-lg z-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            ⏳ Waiting
            <span className="ml-2 text-sm font-normal text-white/60">
              ({waitingTasks.length})
            </span>
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {waitingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  <TaskCard
                    {...task}
                    onClick={() => handleTaskClick(task.id)}
                    onEdit={() => handleTaskClick(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    onDuplicate={() => onDuplicateTask(task.id)}
                    onStatusChange={(status) =>
                      handleTaskStatusChange(task.id, status)
                    }
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {waitingTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass"
              >
                <div className="text-lg font-medium mb-2">No waiting tasks</div>
                <div className="text-sm">
                  Drag tasks here when waiting for approval
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Completed Tasks Column */}
        <AnimatePresence>
          {showCompleted && (
            <motion.div
              className={`flex-1 glass rounded-xl p-4 overflow-y-auto transition-all duration-150 ${
                dragOverColumn === "completed" ? "drag-over" : ""
              }`}
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.15 }}
              onDragOver={(e) => handleDragOver(e, "completed")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "completed")}
            >
              <h2 className="text-xl font-bold text-white/95 mb-6 sticky top-0 glass p-3 rounded-lg z-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                ✅ Completed Tasks
                <span className="ml-2 text-sm font-normal text-white/60">
                  ({completedTasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {completedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.15, delay: index * 0.02 }}
                    >
                      <TaskCard
                        {...task}
                        onClick={() => handleTaskClick(task.id)}
                        onEdit={() => handleTaskClick(task.id)}
                        onDelete={() => onDeleteTask(task.id)}
                        onDuplicate={() => onDuplicateTask(task.id)}
                        onStatusChange={(status) =>
                          handleTaskStatusChange(task.id, status)
                        }
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        onDragEnd={handleDragEnd}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {completedTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass"
                  >
                    <div className="text-lg font-medium mb-2">
                      No completed tasks
                    </div>
                    <div className="text-sm">
                      Drag active tasks here when done
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task Sidebar */}
      <AnimatePresence>
        {selectedTask && (
          <TaskSidebar
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={handleCloseSidebar}
            onSave={handleTaskUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskBoard;
