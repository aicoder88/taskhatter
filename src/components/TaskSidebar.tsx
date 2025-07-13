import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  cost: number;
  ratingBump: number;
  status: "active" | "completed" | "waiting";
  description?: string;
}

interface TaskSidebarProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete?: () => void;
}

const TaskSidebar = ({
  task,
  onClose,
  onUpdate,
  onDelete = () => {},
}: TaskSidebarProps) => {
  const [editedTask, setEditedTask] = useState<Task>({
    id: "sample-task-1",
    title: "Deep Clean Bar Area",
    owner: "Bar Mgr",
    priority: "High",
    dueDate: "2024-01-15",
    cost: 150,
    ratingBump: 0.3,
    status: "active",
    description:
      "Thorough cleaning of bar area including equipment sanitization and inventory organization",
  });

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!task) return false;
    return JSON.stringify(task) !== JSON.stringify(editedTask);
  }, [task, editedTask]);

  // Add keyboard shortcut for saving (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          handleSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]:
        name === "cost" || name === "ratingBump"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Validate required fields before saving
    if (!editedTask.title.trim()) {
      alert('Task title is required');
      return;
    }
    if (!editedTask.owner) {
      alert('Task owner is required');
      return;
    }
    if (!editedTask.dueDate) {
      alert('Due date is required');
      return;
    }
    
    // Save the task
    onUpdate(editedTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-black min-h-screen p-4">
      <motion.div
        className="fixed top-0 right-0 h-full w-full sm:w-[90%] md:w-[420px] bg-black/80 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <div className="p-4 sm:p-6 h-full flex flex-col min-h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Task Details
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${getPriorityColor(editedTask.priority)}`}
                >
                  {editedTask.priority} Priority
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">
                  {editedTask.status === "active"
                    ? "Active"
                    : editedTask.status === "waiting"
                      ? "Waiting"
                      : "Completed"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 flex-grow">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-white font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-emerald-400/20 transition-all"
                placeholder="Enter task title..."
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-white font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedTask.description || ""}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-emerald-400/20 transition-all min-h-[120px] resize-none"
                placeholder="Describe the task details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="owner" className="text-white font-medium">
                  Owner
                </Label>
                <Select
                  value={editedTask.owner}
                  onValueChange={(value) => handleSelectChange("owner", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-emerald-400/50 focus:ring-emerald-400/20">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem
                      value="JP"
                      className="text-white hover:bg-white/10"
                    >
                      JP
                    </SelectItem>
                    <SelectItem
                      value="ALAINE"
                      className="text-white hover:bg-white/10"
                    >
                      ALAINE
                    </SelectItem>
                    <SelectItem
                      value="COLIN"
                      className="text-white hover:bg-white/10"
                    >
                      COLIN
                    </SelectItem>
                    <SelectItem
                      value="ABBY"
                      className="text-white hover:bg-white/10"
                    >
                      ABBY
                    </SelectItem>
                    <SelectItem
                      value="EMMA"
                      className="text-white hover:bg-white/10"
                    >
                      EMMA
                    </SelectItem>
                    <SelectItem
                      value="NOAH"
                      className="text-white hover:bg-white/10"
                    >
                      NOAH
                    </SelectItem>
                    <SelectItem
                      value="ALI"
                      className="text-white hover:bg-white/10"
                    >
                      ALI
                    </SelectItem>
                    <SelectItem
                      value="NATE"
                      className="text-white hover:bg-white/10"
                    >
                      NATE
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="priority" className="text-white font-medium">
                  Priority
                </Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) =>
                    handleSelectChange(
                      "priority",
                      value as "High" | "Medium" | "Low",
                    )
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-emerald-400/50 focus:ring-emerald-400/20">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    <SelectItem
                      value="High"
                      className="text-red-400 hover:bg-white/10"
                    >
                      High
                    </SelectItem>
                    <SelectItem
                      value="Medium"
                      className="text-yellow-400 hover:bg-white/10"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="Low"
                      className="text-green-400 hover:bg-white/10"
                    >
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="dueDate" className="text-white font-medium">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={editedTask.dueDate}
                onChange={handleChange}
                className="bg-white/5 border-white/20 text-white focus:border-emerald-400/50 focus:ring-emerald-400/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="cost" className="text-white font-medium">
                  Cost (CAD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editedTask.cost}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white pl-8 focus:border-emerald-400/50 focus:ring-emerald-400/20 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="ratingBump" className="text-white font-medium">
                  Rating Bump
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    +
                  </span>
                  <Input
                    id="ratingBump"
                    name="ratingBump"
                    type="number"
                    min="0"
                    step="0.05"
                    max="1"
                    value={editedTask.ratingBump}
                    onChange={handleChange}
                    className="bg-white/5 border-white/20 text-white pl-8 focus:border-emerald-400/50 focus:ring-emerald-400/20 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="status" className="text-white font-medium">
                Status
              </Label>
              <Select
                value={editedTask.status}
                onValueChange={(value) =>
                  handleSelectChange(
                    "status",
                    value as "active" | "completed" | "waiting",
                  )
                }
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-emerald-400/50 focus:ring-emerald-400/20">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem
                    value="active"
                    className="text-white hover:bg-white/10"
                  >
                    🚀 Active
                  </SelectItem>
                  <SelectItem
                    value="waiting"
                    className="text-yellow-400 hover:bg-white/10"
                  >
                    ⏳ Waiting
                  </SelectItem>
                  <SelectItem
                    value="completed"
                    className="text-green-400 hover:bg-white/10"
                  >
                    ✅ Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Button - Positioned right after Status field */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-center">
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  title={hasUnsavedChanges ? "Save Changes (Ctrl+S)" : "No changes to save"}
                  className={`${
                    hasUnsavedChanges
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-emerald-500/25 animate-pulse"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  } transition-all px-8 py-3 font-semibold text-lg relative w-full max-w-xs`}
                >
                  💾 Save Changes
                  {hasUnsavedChanges && (
                    <>
                      <span className="ml-2 inline-block w-2 h-2 bg-orange-400 rounded-full animate-ping"></span>
                      <span className="ml-2 text-xs opacity-75">(Ctrl+S)</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </Button>
            <div className="flex-grow"></div>
            <Button
              variant="destructive"
              className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
              onClick={onDelete}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskSidebar;
