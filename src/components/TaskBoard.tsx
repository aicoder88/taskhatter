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
  onReorderTasks?: (tasks: Task[]) => void;
}

const TaskBoard = ({
  tasks = [],
  showCompleted = false,
  onAddTask = () => {},
  onUpdateTask = () => {},
  onDeleteTask = () => {},
  onDuplicateTask = () => {},
  onReorderTasks = () => {},
}: TaskBoardProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);

  const activeTasks = tasks.filter((task) => task.status === "active");
  const waitingTasks = tasks.filter((task) => task.status === "waiting");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleDragStart = (taskId: string) => {
    console.log("🚀 DRAG START:", taskId);
    setDraggingTask(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      console.log("📍 Dragged from column:", task.status);
      setDraggedFromColumn(task.status);
    }
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
    setDraggedFromColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, column: string, index?: number) => {
    e.preventDefault();
    console.log("👆 DRAG OVER:", { column, index, draggingTask });
    setDragOverColumn(column);
    if (index !== undefined) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    targetStatus: "active" | "completed" | "waiting",
    dropIndex?: number,
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    
    // Debug logging
    console.log("🎯 DROP EVENT:", {
      taskId,
      draggingTask,
      targetStatus,
      dropIndex,
      draggedFromColumn,
      sameColumn: draggedFromColumn === targetStatus
    });

    // Fix: Use taskId from drag data instead of draggingTask state
    if (!taskId) {
      console.log("❌ No taskId found in drag data");
      return;
    }

    const draggedTask = tasks.find((t) => t.id === taskId);
    if (!draggedTask) {
      console.log("❌ Dragged task not found:", taskId);
      return;
    }

    // If dropping in the same column, handle reordering
    if (draggedFromColumn === targetStatus && dropIndex !== undefined) {
      console.log("🔄 Reordering within same column");
      const columnTasks = tasks.filter(t => t.status === targetStatus);
      const otherTasks = tasks.filter(t => t.status !== targetStatus);
      
      // Remove the dragged task from its current position
      const filteredColumnTasks = columnTasks.filter(t => t.id !== taskId);
      
      // Insert the dragged task at the new position
      const newColumnTasks = [...filteredColumnTasks];
      newColumnTasks.splice(dropIndex, 0, draggedTask);
      
      // Combine with other column tasks
      const reorderedTasks = [...otherTasks, ...newColumnTasks];
      console.log("📋 New task order:", reorderedTasks.map(t => `${t.title} (${t.status})`));
      onReorderTasks(reorderedTasks);
    }
    // If dropping in a different column, change status
    else if (draggedTask.status !== targetStatus) {
      console.log("📦 Moving to different column");
      onUpdateTask({ ...draggedTask, status: targetStatus });
    }
    
    setDraggingTask(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
    setDraggedFromColumn(null);
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
    <div className="flex flex-col h-full glass rounded-xl p-3 md:p-6 overflow-hidden bg-black/20 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-500 rounded-full blur-xl"></div>
      </div>
      <div className="flex flex-col lg:flex-row flex-1 gap-4 overflow-hidden relative z-10">
        {/* Active Tasks Column */}
        <motion.div
          className={`flex-1 glass rounded-xl p-3 md:p-4 overflow-y-auto transition-all duration-150 min-h-[300px] lg:min-h-0 ${
            dragOverColumn === "active" ? "drag-over" : ""
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          onDragOver={(e) => handleDragOver(e, "active")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "active")}
        >
          <h2 className="text-lg md:text-xl font-bold text-white/95 mb-4 md:mb-6 sticky top-0 glass p-2 md:p-3 rounded-lg z-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            🚀 Active Tasks
            <span className="ml-2 text-xs md:text-sm font-normal text-white/60">
              ({activeTasks.length})
            </span>
          </h2>
          <div className="space-y-3">
            {/* Drop zone at the beginning when dragging */}
            {activeTasks.length > 0 && draggingTask && (
              <div
                className={`transition-all duration-200 ${
                  dragOverColumn === "active" && dragOverIndex === 0 && draggingTask
                    ? "h-16 mb-2 flex items-center justify-center"
                    : "h-8"
                } ${
                  dragOverColumn === "active" && dragOverIndex === 0
                    ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, "active", 0)}
                onDrop={(e) => handleDrop(e, "active", 0)}
              ></div>
            )}

            {/* Active tasks */}
            {activeTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <TaskCard
                  {...task}
                  onStatusChange={handleTaskStatusChange}
                  onClick={handleTaskClick}
                  onEdit={() => handleTaskClick(task.id)}
                  onDuplicate={() => onDuplicateTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                />
                {/* Drop zone between tasks */}
                {draggingTask && draggingTask !== task.id && (
                  <div
                    className={`transition-all duration-200 ${
                      dragOverColumn === "active" && dragOverIndex === index + 1
                        ? "h-16 my-2 flex items-center justify-center"
                        : "h-0"
                    } ${
                      dragOverColumn === "active" && dragOverIndex === index + 1
                        ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                        : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, "active", index + 1)}
                    onDrop={(e) => handleDrop(e, "active", index + 1)}
                  ></div>
                )}
              </React.Fragment>
            ))}

            {/* Empty state */}
            {activeTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/20 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">No active tasks</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddTask}
                  className="flex items-center gap-1 text-xs"
                >
                  <PlusCircle className="h-3 w-3" />
                  Add Task
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Waiting Tasks Column */}
        <motion.div
          className={`flex-1 glass rounded-xl p-3 md:p-4 overflow-y-auto transition-all duration-150 min-h-[300px] lg:min-h-0 mt-4 lg:mt-0 ${
            dragOverColumn === "waiting" ? "drag-over" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          onDragOver={(e) => handleDragOver(e, "waiting")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "waiting")}
        >
          <h2 className="text-lg md:text-xl font-bold text-white/95 mb-4 md:mb-6 sticky top-0 glass p-2 md:p-3 rounded-lg z-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            ⏳ Waiting
            <span className="ml-2 text-xs md:text-sm font-normal text-white/60">
              ({waitingTasks.length})
            </span>
          </h2>
          <div className="space-y-3">
            {/* Drop zone at the beginning when dragging */}
            {waitingTasks.length > 0 && draggingTask && (
              <div
                className={`transition-all duration-200 ${
                  dragOverColumn === "waiting" && dragOverIndex === 0
                    ? "h-16 mb-2 flex items-center justify-center"
                    : "h-8"
                } ${
                  dragOverColumn === "waiting" && dragOverIndex === 0
                    ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, "waiting", 0)}
                onDrop={(e) => handleDrop(e, "waiting", 0)}
              ></div>
            )}

            {/* Waiting tasks */}
            {waitingTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <TaskCard
                  {...task}
                  onStatusChange={handleTaskStatusChange}
                  onClick={handleTaskClick}
                  onEdit={() => handleTaskClick(task.id)}
                  onDuplicate={() => onDuplicateTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                />
                {/* Drop zone between tasks */}
                {draggingTask && draggingTask !== task.id && (
                  <div
                    className={`transition-all duration-200 ${
                      dragOverColumn === "waiting" && dragOverIndex === index + 1
                        ? "h-16 my-2 flex items-center justify-center"
                        : "h-0"
                    } ${
                      dragOverColumn === "waiting" && dragOverIndex === index + 1
                        ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                        : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, "waiting", index + 1)}
                    onDrop={(e) => handleDrop(e, "waiting", index + 1)}
                  ></div>
                )}
              </React.Fragment>
            ))}

            {/* Empty state */}
            {waitingTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/20 rounded-xl p-4">
                <p className="text-white/60 text-sm">No waiting tasks</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Completed Tasks Column */}
        {showCompleted && (
          <motion.div
            className={`flex-1 glass rounded-xl p-3 md:p-4 overflow-y-auto transition-all duration-150 min-h-[300px] lg:min-h-0 mt-4 lg:mt-0 ${
              dragOverColumn === "completed" ? "drag-over" : ""
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            onDragOver={(e) => handleDragOver(e, "completed")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "completed")}
          >
            <h2 className="text-lg md:text-xl font-bold text-white/95 mb-4 md:mb-6 sticky top-0 glass p-2 md:p-3 rounded-lg z-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              ✅ Completed
              <span className="ml-2 text-xs md:text-sm font-normal text-white/60">
                ({completedTasks.length})
              </span>
            </h2>
            <div className="space-y-3">
              {/* Drop zone at the beginning when dragging */}
              {completedTasks.length > 0 && draggingTask && (
                <div
                  className={`transition-all duration-200 ${
                    dragOverColumn === "completed" && dragOverIndex === 0
                      ? "h-16 mb-2 flex items-center justify-center"
                      : "h-8"
                  } ${
                    dragOverColumn === "completed" && dragOverIndex === 0
                      ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                      : ""
                  }`}
                  onDragOver={(e) => handleDragOver(e, "completed", 0)}
                  onDrop={(e) => handleDrop(e, "completed", 0)}
                ></div>
              )}

              {/* Completed tasks */}
              {completedTasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <TaskCard
                    {...task}
                    onStatusChange={handleTaskStatusChange}
                    onClick={handleTaskClick}
                    onEdit={() => handleTaskClick(task.id)}
                    onDuplicate={() => onDuplicateTask(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                  />
                  {/* Drop zone between tasks */}
                  {draggingTask && draggingTask !== task.id && (
                    <div
                      className={`transition-all duration-200 ${
                        dragOverColumn === "completed" && dragOverIndex === index + 1
                          ? "h-16 my-2 flex items-center justify-center"
                          : "h-0"
                      } ${
                        dragOverColumn === "completed" && dragOverIndex === index + 1
                          ? "border-2 border-dashed border-purple-500/50 rounded-lg bg-purple-500/10"
                          : ""
                      }`}
                      onDragOver={(e) => handleDragOver(e, "completed", index + 1)}
                      onDrop={(e) => handleDrop(e, "completed", index + 1)}
                    ></div>
                  )}
                </React.Fragment>
              ))}

              {/* Empty state */}
              {completedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/20 rounded-xl p-4">
                  <p className="text-white/60 text-sm">No completed tasks</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Task Sidebar */}
      <AnimatePresence>
        {selectedTask && (
          <TaskSidebar
            task={selectedTask}
            onClose={handleCloseSidebar}
            onUpdate={handleTaskUpdate}
            onDelete={() => {
              onDeleteTask(selectedTask.id);
              setSelectedTask(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskBoard;
