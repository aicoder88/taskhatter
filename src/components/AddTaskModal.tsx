import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onAddTask: (task: Omit<Task, "id" | "status">) => void;
}

const AddTaskModal = ({
  isOpen = true,
  onClose,
  onAddTask,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [cost, setCost] = useState<number>(0);
  const [ratingBump, setRatingBump] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!owner) newErrors.owner = "Owner is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (cost < 0) newErrors.cost = "Cost cannot be negative";
    if (ratingBump < 0 || ratingBump > 1)
      newErrors.ratingBump = "Rating bump must be between 0 and 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddTask({
      title: title.trim(),
      owner,
      priority,
      dueDate: format(dueDate!, "yyyy-MM-dd"),
      cost,
      ratingBump,
    });

    // Reset form
    setTitle("");
    setOwner("");
    setPriority("Medium");
    setDueDate(new Date());
    setCost(0);
    setRatingBump(0);
    setErrors({});

    onClose(false);
  };

  const handleClose = () => {
    setErrors({});
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass border-white/20 text-white max-w-md md:max-w-lg w-[90vw] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white/95">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/90 font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="glass-button border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-purple-400/20"
              required
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner" className="text-white/90 font-medium">
              Owner *
            </Label>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger
                id="owner"
                className="glass-button border-white/20 text-white focus:border-purple-400/50 focus:ring-purple-400/20"
              >
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20 text-white">
                <SelectItem value="JP">JP</SelectItem>
                <SelectItem value="ALAINE">ALAINE</SelectItem>
                <SelectItem value="COLIN">COLIN</SelectItem>
                <SelectItem value="ABBY">ABBY</SelectItem>
                <SelectItem value="EMMA">EMMA</SelectItem>
                <SelectItem value="NOAH">NOAH</SelectItem>
                <SelectItem value="ALI">ALI</SelectItem>
                <SelectItem value="NATE">NATE</SelectItem>
              </SelectContent>
            </Select>
            {errors.owner && (
              <p className="text-red-400 text-xs">{errors.owner}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white/90 font-medium">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value: "High" | "Medium" | "Low") =>
                setPriority(value)
              }
            >
              <SelectTrigger
                id="priority"
                className="glass-button border-white/20 text-white focus:border-purple-400/50 focus:ring-purple-400/20"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="glass border-white/20 text-white">
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-white/90 font-medium">
              Due Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass-button border-white/20 text-white hover:bg-white/10 focus:border-purple-400/50",
                    !dueDate && "text-white/50",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass border-white/20">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="glass text-white"
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && (
              <p className="text-red-400 text-xs">{errors.dueDate}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost" className="text-white/90 font-medium">
                Cost (CAD)
              </Label>
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="glass-button border-white/20 text-white focus:border-purple-400/50 focus:ring-purple-400/20"
                min="0"
                step="100"
                placeholder="0"
              />
              {errors.cost && (
                <p className="text-red-400 text-xs">{errors.cost}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratingBump" className="text-white/90 font-medium">
                Rating Bump
              </Label>
              <Input
                id="ratingBump"
                type="number"
                value={ratingBump}
                onChange={(e) => setRatingBump(Number(e.target.value))}
                className="glass-button border-white/20 text-white focus:border-purple-400/50 focus:ring-purple-400/20"
                min="0"
                max="1"
                step="0.05"
                placeholder="0.00"
              />
              {errors.ratingBump && (
                <p className="text-red-400 text-xs">{errors.ratingBump}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="glass-button border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg transition-all duration-150"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
