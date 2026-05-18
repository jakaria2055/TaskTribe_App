import { useState } from "react";
import { format, isSameDay, isBefore, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { CalendarIcon, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

const typeColors = {
    BUG: "bg-red-200 text-red-800 dark:bg-red-500 dark:text-red-900",
    FEATURE: "bg-blue-200 text-blue-800 dark:bg-blue-500 dark:text-blue-900",
    TASK: "bg-green-200 text-green-800 dark:bg-green-500 dark:text-green-900",
    IMPROVEMENT: "bg-purple-200 text-purple-800 dark:bg-purple-500 dark:text-purple-900",
    OTHER: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
};

const priorityBorders = {
    LOW: "border-zinc-300 dark:border-zinc-600",
    MEDIUM: "border-amber-300 dark:border-amber-500",
    HIGH: "border-orange-300 dark:border-orange-500",
};

const ProjectCalendar = ({ tasks }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const today = new Date();

    const getTasksForDate = (date) =>
        tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), date));

    const upcomingTasks = tasks
        .filter((task) => task.due_date && !isBefore(new Date(task.due_date), today) && task.status !== "DONE")
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    const overdueTasks = tasks.filter(
        (task) => task.due_date && isBefore(new Date(task.due_date), today) && task.status !== "DONE"
    );

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const startDay = startOfMonth(currentMonth).getDay(); // 0=Sun ... 6=Sat

    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) => direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
                <div className="dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-zinc-900 dark:text-white text-md flex gap-2 items-center max-sm:hidden">
                            <CalendarIcon className="size-5" /> Task Calendar
                        </h2>
                        <div className="flex gap-2 items-center">
                            <button onClick={() => handleMonthChange("prev")} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                <ChevronLeft className="size-5 text-zinc-600 dark:text-zinc-400" />
                            </button>
                            <span className="text-zinc-900 dark:text-white font-medium min-w-32 text-center">
                                {format(currentMonth, "MMMM yyyy")}
                            </span>
                            <button onClick={() => handleMonthChange("next")} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                                <ChevronRight className="size-5 text-zinc-600 dark:text-zinc-400" />
                            </button>
                        </div>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }} className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 text-center">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="py-1">{d}</div>
                        ))}
                    </div>

                    {/* Day grid — using inline style to guarantee 7 columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                        {/* Offset empty cells */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {daysInMonth.map((day) => {
                            const dayTasks = getTasksForDate(day);
                            const isSelected = isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, today);
                            const hasOverdue = dayTasks.some(
                                (t) => t.status !== "DONE" && isBefore(new Date(t.due_date), today)
                            );

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    style={{ minHeight: "46px" }}
                                    className={`rounded-md flex flex-col items-center justify-center text-sm transition
                                        ${isSelected
                                            ? "bg-blue-500 text-white"
                                            : isToday
                                                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400"
                                                : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        }
                                        ${hasOverdue ? "ring-1 ring-red-400" : ""}
                                    `}
                                >
                                    <span className={isToday && !isSelected ? "font-bold" : ""}>
                                        {format(day, "d")}
                                    </span>
                                    {dayTasks.length > 0 && (
                                        <span className={`text-[10px] leading-none mt-0.5 ${isSelected ? "text-blue-100" : "text-blue-500 dark:text-blue-400"}`}>
                                            {dayTasks.length}t
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks for selected day */}
                <div className="dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 mt-4">
                    <h3 className="text-zinc-900 dark:text-white text-sm font-medium mb-3">
                        {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    {getTasksForDate(selectedDate).length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-4">No tasks for this day</p>
                    ) : (
                        <div className="space-y-2">
                            {getTasksForDate(selectedDate).map((task) => (
                                <div
                                    key={task.id}
                                    className={`bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition p-3 rounded border-l-4 ${priorityBorders[task.priority]}`}
                                >
                                    <div className="flex justify-between mb-1">
                                        <h4 className="text-zinc-900 dark:text-white text-sm font-medium">{task.title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-xs ${typeColors[task.type]}`}>
                                            {task.type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                        <span className="capitalize">{task.priority?.toLowerCase()} priority</span>
                                        {task.assignee && (
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {task.assignee.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
                {/* Upcoming */}
                <div className="dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4">
                    <h3 className="text-zinc-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4" /> Upcoming Tasks
                    </h3>
                    {upcomingTasks.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-4">No upcoming tasks</p>
                    ) : (
                        <div className="space-y-2">
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3 rounded-lg transition">
                                    <div className="flex justify-between items-start gap-2 text-sm">
                                        <span className="text-zinc-900 dark:text-white truncate">{task.title}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${typeColors[task.type]}`}>
                                            {task.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                        {format(new Date(task.due_date), "MMM d, yyyy")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Overdue */}
                {overdueTasks.length > 0 && (
                    <div className="border border-l-4 border-red-300 dark:border-red-500 rounded-lg p-4">
                        <h3 className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4" /> Overdue ({overdueTasks.length})
                        </h3>
                        <div className="space-y-2">
                            {overdueTasks.slice(0, 5).map((task) => (
                                <div key={task.id} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                    <div className="flex justify-between gap-2 text-sm">
                                        <span className="text-zinc-900 dark:text-white truncate">{task.title}</span>
                                        <span className="text-xs px-2 py-0.5 rounded shrink-0 bg-red-200 dark:bg-red-500 text-red-900">
                                            {task.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                        Due {format(new Date(task.due_date), "MMM d")}
                                    </p>
                                </div>
                            ))}
                            {overdueTasks.length > 5 && (
                                <p className="text-xs text-zinc-500 text-center">+{overdueTasks.length - 5} more</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCalendar;