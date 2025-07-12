import React, { useState } from "react";
import TaskBoard from "./TaskBoard";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import AddTaskModal from "./AddTaskModal";
import DashboardHeader from "./dashboard/DashboardHeader";
import { motion } from "framer-motion";

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

const seedTasks: Task[] = [
  {
    id: "1",
    title: "Deep-clean bathrooms & hygiene reboot",
    owner: "JP",
    priority: "High",
    dueDate: "2025-07-18",
    cost: 2000,
    ratingBump: 0.3,
    status: "active",
    complaint: "Bathroom was very disgusting… tables and ground are sticky.",
    sources: ["Google Apr 19 2025", "Yelp May 8 2024", "Google May 6 2025", "Google Dec 20 2024", "Resto Jul 2 2025"],
    inspiration: "Google Reviews & Yelp",
    mentions: 5,
  },
  {
    id: "2",
    title: "Standardize pours with jiggers, train staff",
    owner: "ALAINE",
    priority: "High",
    dueDate: "2025-07-15",
    cost: 300,
    ratingBump: 0.25,
    status: "active",
    complaint: "Ordered a double vodka-coke and got straight Coke – no vodka.",
    sources: ["Yelp Aug 17 2024", "Yelp May 8 2024", "Reddit thread complaints 2025"],
    inspiration: "Yelp Reviews",
    mentions: 3,
  },
  {
    id: "3",
    title: "Fire aggressive bouncer, hire licensed firm",
    owner: "COLIN",
    priority: "High",
    dueDate: "2025-07-14",
    cost: 1800,
    ratingBump: 0.2,
    status: "active",
    complaint: "Bouncer picked my friend up and raised his fist at me.",
    sources: ["Google Feb 18 2025 (highlighted on Wanderlog)"],
    inspiration: "Google Reviews",
    mentions: 1,
  },
  {
    id: "4",
    title: "Replace broken tables & tighten stools",
    owner: "ABBY",
    priority: "Medium",
    dueDate: "2025-07-25",
    cost: 3500,
    ratingBump: 0.15,
    status: "active",
    complaint: "Lean on a table and it breaks in 3 pieces.",
    sources: ["Resto Jul 2 2025", "Yelp May 8 2024", "Google Apr 19 2025"],
    inspiration: "Multiple Review Platforms",
    mentions: 3,
  },
  {
    id: "5",
    title: "Add runner & handheld POS on weekends",
    owner: "EMMA",
    priority: "Medium",
    dueDate: "2025-08-02",
    cost: 4800,
    ratingBump: 0.1,
    status: "active",
    complaint: "Waited ages, couldn't even pay at the bar.",
    sources: ["Yelp Jul 25 2018", "Google Dec 20 2024", "Yelp Jul 2 2022"],
    inspiration: "Yelp Reviews",
    mentions: 3,
  },
  {
    id: "6",
    title: "Fix kitchen comms, post hours, late-night snacks",
    owner: "NOAH",
    priority: "Low",
    dueDate: "2025-08-05",
    cost: 500,
    ratingBump: 0.05,
    status: "active",
    complaint: "Bartender took food order, came back: kitchen's been closed the whole time.",
    sources: ["Yelp Jul 2 2022", "Wanderlog highlight Jan 2025"],
    inspiration: "Yelp & Wanderlog",
    mentions: 2,
  },
  {
    id: "7",
    title: "Tune music to 90 dB & set HVAC to 22 °C",
    owner: "ALI",
    priority: "Low",
    dueDate: "2025-07-15",
    cost: 0,
    ratingBump: 0.05,
    status: "active",
    complaint: "Music was too loud to talk… we kept our coats on.",
    sources: ["Google Dec 20 2024", "multiple Google 3★ reviews 2024-25"],
    inspiration: "Google Reviews",
    mentions: 2,
  },
  {
    id: "8",
    title: "Update inventory management system",
    owner: "NATE",
    priority: "Medium",
    dueDate: "2025-07-20",
    cost: 1200,
    ratingBump: 0.12,
    status: "completed",
    complaint: "System crashes during busy periods, causing delays.",
    sources: ["Internal Staff Reports"],
    inspiration: "Staff Feedback",
    mentions: 1,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleAddTask = (newTask: Omit<Task, "id" | "status">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      status: "active",
    };
    setTasks([...tasks, task]);
    setIsAddTaskModalOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleDuplicateTask = (taskId: string) => {
    const taskToDuplicate = tasks.find((task) => task.id === taskId);
    if (taskToDuplicate) {
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: Date.now().toString(),
        title: `${taskToDuplicate.title} (Copy)`,
      };
      setTasks([...tasks, duplicatedTask]);
    }
  };

  const handleReorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-purple-400 rounded-full blur-2xl"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 backdrop-blur-md bg-black/30 p-6 rounded-xl border border-gray-800 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-50"></div>
          <div className="flex items-center mb-4 md:mb-0 relative z-10">
            <img
              src="/logo-light-sm.png"
              alt="Hatter Pulse Logo"
              className="h-16 w-16 mr-4 rounded-lg shadow-lg"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                Hatter Pulse
              </h1>
              <p className="text-sm text-white/60 font-medium">
                Task Management System
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            <Button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-none backdrop-blur-md shadow-lg transition-all duration-200"
            >
              Add Task
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed">Show Completed Tasks</Label>
            </div>
          </div>
        </header>

        {/* Dashboard Header with Visualizations */}
        <DashboardHeader tasks={tasks} className="mb-6" />

        <TaskBoard
          tasks={tasks}
          showCompleted={showCompleted}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onDuplicateTask={handleDuplicateTask}
          onReorderTasks={handleReorderTasks}
        />

        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      </motion.div>
    </div>
  );
}
