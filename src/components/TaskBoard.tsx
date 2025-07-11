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
            {/* Drop zone at the beginning when dragging */}
            {activeTasks.length > 0 && draggingTask && (
              <div
                className={`transition-all duration-200 ${
                  dragOverColumn === "active" && dragOverIndex === 0 && draggingTask
                    ? "h-16 mb-2 flex items-center justify-center"
                    : "h-8"
                }`}
                onDragOver={(e) => handleDragOver(e, "active", 0)}
                onDrop={(e) => handleDrop(e, "active", 0)}
              >
                {dragOverColumn === "active" && dragOverIndex === 0 && draggingTask && (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                  </div>
                )}
              </div>
            )}
            <AnimatePresence>
              {activeTasks.map((task, index) => (
                <div key={task.id}>
                  {/* Drop zone before task */}
                  <div
                    className={`transition-all duration-200 ${
                      dragOverColumn === "active" && dragOverIndex === index && draggingTask !== task.id
                        ? "h-16 mb-2 flex items-center justify-center"
                        : "h-8"
                    }`}
                    onDragOver={(e) => handleDragOver(e, "active", index)}
                    onDrop={(e) => handleDrop(e, "active", index)}
                  >
                    {dragOverColumn === "active" && dragOverIndex === index && draggingTask !== task.id && (
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <motion.div
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
                        handleTaskStatusChange(task.id, status as "active" | "completed" | "waiting")
                      }
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    />
                  </motion.div>
                  {/* Drop zone after last task */}
                  {index === activeTasks.length - 1 && (
                    <div
                      className={`transition-all duration-200 ${
                        dragOverColumn === "active" && dragOverIndex === activeTasks.length && draggingTask !== task.id
                          ? "h-16 mt-2 flex items-center justify-center"
                          : "h-8"
                      }`}
                      onDragOver={(e) => handleDragOver(e, "active", activeTasks.length)}
                      onDrop={(e) => handleDrop(e, "active", activeTasks.length)}
                    >
                      {dragOverColumn === "active" && dragOverIndex === activeTasks.length && draggingTask !== task.id && (
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                          <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>
            {activeTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass transition-all duration-150 ${
                  dragOverColumn === "active" ? "border-purple-500/40 bg-purple-500/10" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, "active", 0)}
                onDrop={(e) => handleDrop(e, "active", 0)}
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
            {/* Drop zone at the beginning when dragging */}
            {waitingTasks.length > 0 && draggingTask && (
              <div
                className={`transition-all duration-200 ${
                  dragOverColumn === "waiting" && dragOverIndex === 0 && draggingTask
                    ? "h-16 mb-2 flex items-center justify-center"
                    : "h-8"
                }`}
                onDragOver={(e) => handleDragOver(e, "waiting", 0)}
                onDrop={(e) => handleDrop(e, "waiting", 0)}
              >
                {dragOverColumn === "waiting" && dragOverIndex === 0 && draggingTask && (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/50 animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 via-yellow-400 to-yellow-400/20 rounded-full"></div>
                  </div>
                )}
              </div>
            )}
            <AnimatePresence>
              {waitingTasks.map((task, index) => (
                <div key={task.id}>
                  {/* Drop zone before task */}
                  <div
                    className={`transition-all duration-200 ${
                      dragOverColumn === "waiting" && dragOverIndex === index && draggingTask !== task.id
                        ? "h-16 mb-2 flex items-center justify-center"
                        : "h-8"
                    }`}
                    onDragOver={(e) => handleDragOver(e, "waiting", index)}
                    onDrop={(e) => handleDrop(e, "waiting", index)}
                  >
                    {dragOverColumn === "waiting" && dragOverIndex === index && draggingTask !== task.id && (
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/50 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 via-yellow-400 to-yellow-400/20 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <motion.div
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
                        handleTaskStatusChange(task.id, status as "active" | "completed" | "waiting")
                      }
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    />
                  </motion.div>
                  {/* Drop zone after last task */}
                  {index === waitingTasks.length - 1 && (
                    <div
                      className={`transition-all duration-200 ${
                        dragOverColumn === "waiting" && dragOverIndex === waitingTasks.length && draggingTask !== task.id
                          ? "h-16 mt-2 flex items-center justify-center"
                          : "h-8"
                      }`}
                      onDragOver={(e) => handleDragOver(e, "waiting", waitingTasks.length)}
                      onDrop={(e) => handleDrop(e, "waiting", waitingTasks.length)}
                    >
                      {dragOverColumn === "waiting" && dragOverIndex === waitingTasks.length && draggingTask !== task.id && (
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/50 animate-pulse">
                          <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 via-yellow-400 to-yellow-400/20 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>
            {waitingTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass transition-all duration-150 ${
                  dragOverColumn === "waiting" ? "border-yellow-500/40 bg-yellow-500/10" : ""
                }`}
                onDragOver={(e) => handleDragOver(e, "waiting", 0)}
                onDrop={(e) => handleDrop(e, "waiting", 0)}
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
                {/* Drop zone at the beginning when dragging */}
                {completedTasks.length > 0 && draggingTask && (
                  <div
                    className={`transition-all duration-200 ${
                      dragOverColumn === "completed" && dragOverIndex === 0 && draggingTask
                        ? "h-16 mb-2 flex items-center justify-center"
                        : "h-8"
                    }`}
                    onDragOver={(e) => handleDragOver(e, "completed", 0)}
                    onDrop={(e) => handleDrop(e, "completed", 0)}
                  >
                    {dragOverColumn === "completed" && dragOverIndex === 0 && draggingTask && (
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}
                <AnimatePresence>
                  {completedTasks.map((task, index) => (
                    <div key={task.id}>
                      {/* Drop zone before task */}
                      <div
                        className={`transition-all duration-200 ${
                          dragOverColumn === "completed" && dragOverIndex === index && draggingTask !== task.id
                            ? "h-16 mb-2 flex items-center justify-center"
                            : "h-8"
                        }`}
                        onDragOver={(e) => handleDragOver(e, "completed", index)}
                        onDrop={(e) => handleDrop(e, "completed", index)}
                      >
                        {dragOverColumn === "completed" && dragOverIndex === index && draggingTask !== task.id && (
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                            <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <motion.div
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
                            handleTaskStatusChange(task.id, status as "active" | "completed" | "waiting")
                          }
                          draggable
                          onDragStart={() => handleDragStart(task.id)}
                          onDragEnd={handleDragEnd}
                        />
                      </motion.div>
                      {/* Drop zone after last task */}
                      {index === completedTasks.length - 1 && (
                        <div
                          className={`transition-all duration-200 ${
                            dragOverColumn === "completed" && dragOverIndex === completedTasks.length && draggingTask !== task.id
                              ? "h-16 mt-2 flex items-center justify-center"
                              : "h-8"
                          }`}
                          onDragOver={(e) => handleDragOver(e, "completed", completedTasks.length)}
                          onDrop={(e) => handleDrop(e, "completed", completedTasks.length)}
                        >
                          {dragOverColumn === "completed" && dragOverIndex === completedTasks.length && draggingTask !== task.id && (
                            <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full shadow-lg shadow-purple-400/50 animate-pulse">
                              <div className="w-full h-full bg-gradient-to-r from-purple-400/20 via-purple-400 to-purple-400/20 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
                {completedTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-white/40 text-center p-8 border border-dashed border-white/20 rounded-xl glass transition-all duration-150 ${
                      dragOverColumn === "completed" ? "border-purple-500/40 bg-purple-500/10" : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, "completed", 0)}
                    onDrop={(e) => handleDrop(e, "completed", 0)}
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
