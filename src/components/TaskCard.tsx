import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Trash2, MessageSquare, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TaskCardProps {
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
  onStatusChange?: (
    id: string,
    status: "active" | "completed" | "waiting",
  ) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id = "1",
  title = "Task Title",
  owner = "Unassigned",
  priority = "Medium",
  dueDate = "2025-07-15",
  cost = 0,
  ratingBump = 0,
  status = "active",
  complaint = "",
  sources = [],
  inspiration = "",
  mentions = 0,
  onStatusChange = () => {},
  onEdit = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
  onClick = () => {},
  draggable = false,
  onDragStart = () => {},
  onDragEnd = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const priorityColors = {
    High: "bg-red-500/20 text-red-300 border-red-500/40",
    Medium: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    Low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      onStatusChange(id, "completed");
    } else {
      onStatusChange(id, status === "waiting" ? "waiting" : "active");
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLElement &&
      !e.target.closest("[data-no-card-click]")
    ) {
      onClick(id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`w-full ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        className={`glass-card relative w-full p-3 sm:p-4 cursor-pointer overflow-hidden transition-all duration-150 ${
          status === "completed" ? "opacity-70" : ""
        } ${status === "waiting" ? "border-yellow-500/40 bg-yellow-500/5" : ""} ${isHovered ? "neon-accent" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            status === "waiting"
              ? "bg-gradient-to-br from-yellow-500/[0.05] to-orange-500/[0.02]"
              : status === "completed"
                ? "bg-gradient-to-br from-purple-500/[0.05] to-pink-500/[0.02]"
                : "bg-gradient-to-br from-white/[0.02] to-transparent"
          }`}
        />

        <div className="flex justify-between items-start mb-2 sm:mb-3 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div data-no-card-click>
              <Checkbox
                checked={status === "completed"}
                onCheckedChange={handleCheckboxChange}
                className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <h3 className="font-semibold text-white/95 text-xs sm:text-sm leading-relaxed break-words">
              {title}
            </h3>
          </div>

          <div data-no-card-click>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/10 transition-all duration-150 opacity-70 hover:opacity-100"
                  aria-label="Task options"
                >
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass border-white/20 text-white"
              >
                <DropdownMenuItem
                  className="flex items-center gap-2 text-white/80 hover:text-white focus:text-white cursor-pointer hover:bg-white/10"
                  onClick={() => onEdit(id)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-white/80 hover:text-white focus:text-white cursor-pointer hover:bg-white/10"
                  onClick={() => onDuplicate(id)}
                >
                  <Copy className="h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer hover:bg-red-500/10"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 relative z-10">
          <div className="text-xs">
            <span className="block text-white/50 font-medium mb-0.5 sm:mb-1 text-[10px] sm:text-xs">Owner</span>
            <span className="text-white/90 font-medium text-xs sm:text-sm">{owner}</span>
          </div>
          <div className="text-xs">
            <span className="block text-white/50 font-medium mb-0.5 sm:mb-1 text-[10px] sm:text-xs">
              Due Date
            </span>
            <span className="text-white/90 font-medium text-xs sm:text-sm">{dueDate}</span>
          </div>
        </div>

        {/* Complaint Information Section */}
        {(complaint || sources?.length || inspiration || mentions) && (
          <div className="mb-3 sm:mb-4 relative z-10">
            {complaint && (
              <div className="mb-2">
                <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-400" />
                  <span className="text-white/50 font-medium text-[10px] sm:text-xs">Complaint</span>
                </div>
                <p className="text-white/80 text-[10px] sm:text-xs italic leading-relaxed">
                  "{complaint}"
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 sm:gap-2 text-[10px] sm:text-xs">
              {inspiration && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-400" />
                  <span className="text-white/50">Inspired by:</span>
                  <span className="text-blue-400 font-medium">{inspiration}</span>
                </div>
              )}
              
              {mentions > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-white/50">Mentions:</span>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 border text-[10px] sm:text-xs px-1 py-0">
                    {mentions}
                  </Badge>
                </div>
              )}
              
              {sources && sources.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-white/50">Sources:</span>
                  <span className="text-white/70 text-[10px] sm:text-xs">
                    {sources.slice(0, 2).join(", ")}
                    {sources.length > 2 && ` +${sources.length - 2} more`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center relative z-10">
          <div className="flex gap-1 sm:gap-2">
            <Badge
              className={`${priorityColors[priority]} border text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1`}
            >
              {priority}
            </Badge>
            {status === "waiting" && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40 border text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1">
                ⏳ Waiting
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-white/50 text-[10px] sm:text-xs font-medium">Cost</span>
              <span className="text-white/90 text-xs sm:text-sm font-medium">${cost}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white/50 text-[10px] sm:text-xs font-medium">Rating</span>
              <span className="text-white/90 text-xs sm:text-sm font-medium">+{ratingBump}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
