import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap } from "lucide-react";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
    IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
    OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
    LOW: { background: "bg-red-100 dark:bg-red-950", prioritycolor: "text-red-600 dark:text-red-400" },
    MEDIUM: { background: "bg-blue-100 dark:bg-blue-950", prioritycolor: "text-blue-600 dark:text-blue-400" },
    HIGH: { background: "bg-emerald-100 dark:bg-emerald-950", prioritycolor: "text-emerald-600 dark:text-emerald-400" },
};

const ProjectTasks = ({ tasks }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            toast.loading("Updating status...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            let updatedTask = structuredClone(tasks.find((t) => t.id === taskId));
            updatedTask.status = newStatus;
            dispatch(updateTask(updatedTask));
            toast.dismiss();
            toast.success("Task status updated successfully");
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete the selected tasks?");
            if (!confirm) return;
            toast.loading("Deleting tasks...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            dispatch(deleteTask(selectedTasks));
            toast.dismiss();
            toast.success("Tasks deleted successfully");
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const filterOptions = {
        status: [
            { label: "All Statuses", value: "" },
            { label: "To Do", value: "TODO" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Done", value: "DONE" },
        ],
        type: [
            { label: "All Types", value: "" },
            { label: "Task", value: "TASK" },
            { label: "Bug", value: "BUG" },
            { label: "Feature", value: "FEATURE" },
            { label: "Improvement", value: "IMPROVEMENT" },
            { label: "Other", value: "OTHER" },
        ],
        priority: [
            { label: "All Priorities", value: "" },
            { label: "Low", value: "LOW" },
            { label: "Medium", value: "MEDIUM" },
            { label: "High", value: "HIGH" },
        ],
        assignee: [
            { label: "All Assignees", value: "" },
            ...assigneeList.map((n) => ({ label: n, value: n })),
        ],
    };

    const hasActiveFilters = filters.status || filters.type || filters.priority || filters.assignee;

    return (
        <div>
            {/* Filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                {["status", "type", "priority", "assignee"].map((name) => (
                    <select
                        key={name}
                        name={name}
                        onChange={handleFilterChange}
                        value={filters[name]}
                        style={{ border: "1px solid #d4d4d8", borderRadius: "6px", padding: "4px 12px", fontSize: "14px", outline: "none", background: "transparent", color: "inherit" }}
                    >
                        {filterOptions[name].map((opt, idx) => (
                            <option key={idx} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ))}

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "6px", background: "linear-gradient(135deg, #c084fc, #a855f7)", color: "white", fontSize: "14px", border: "none", cursor: "pointer" }}
                    >
                        <XIcon size={12} /> Reset
                    </button>
                )}

                {selectedTasks.length > 0 && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "6px", background: "linear-gradient(135deg, #818cf8, #6366f1)", color: "white", fontSize: "14px", border: "none", cursor: "pointer" }}
                    >
                        <Trash size={12} /> Delete ({selectedTasks.length})
                    </button>
                )}
            </div>

            {/* Table — using inline styles to guarantee layout */}
            <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e4e4e7" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "700px" }}>
                    <thead>
                        <tr style={{ background: "rgba(39,39,42,0.07)" }}>
                            <th style={{ padding: "10px 8px", textAlign: "left", width: "32px" }}>
                                <input
                                    type="checkbox"
                                    onChange={() =>
                                        selectedTasks.length === tasks.length
                                            ? setSelectedTasks([])
                                            : setSelectedTasks(tasks.map((t) => t.id))
                                    }
                                    checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                                    style={{ width: "13px", height: "13px" }}
                                />
                            </th>
                            {["Title", "Type", "Priority", "Status", "Assignee", "Due Date"].map((h) => (
                                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#71717a", fontWeight: 600, whiteSpace: "nowrap" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
                            const { icon: Icon, color } = typeIcons[task.type] || {};
                            const { background, prioritycolor } = priorityTexts[task.priority] || {};

                            return (
                                <tr
                                    key={task.id}
                                    onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)}
                                    style={{ borderTop: "1px solid #e4e4e7", cursor: "pointer", transition: "background 0.15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(244,244,245,0.5)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td
                                        onClick={e => e.stopPropagation()}
                                        style={{ padding: "8px", paddingLeft: "8px" }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{ width: "13px", height: "13px" }}
                                            onChange={() =>
                                                selectedTasks.includes(task.id)
                                                    ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id))
                                                    : setSelectedTasks((prev) => [...prev, task.id])
                                            }
                                            checked={selectedTasks.includes(task.id)}
                                        />
                                    </td>

                                    <td style={{ padding: "8px 16px", whiteSpace: "nowrap", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {task.title}
                                    </td>

                                    <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            {Icon && <Icon size={14} className={color} />}
                                            <span className={`text-xs uppercase ${color}`}>{task.type}</span>
                                        </div>
                                    </td>

                                    <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}>
                                        <span className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}>
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td
                                        onClick={e => e.stopPropagation()}
                                        style={{ padding: "8px 16px", whiteSpace: "nowrap" }}
                                    >
                                        <select
                                            name="status"
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            value={task.status}
                                            style={{ outline: "none", padding: "2px 8px", borderRadius: "4px", fontSize: "13px", cursor: "pointer", background: "transparent", color: "inherit", border: "1px solid transparent" }}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </td>

                                    <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {task.assignee?.image && (
                                                <img
                                                    src={task.assignee.image}
                                                    style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                                                    alt="avatar"
                                                />
                                            )}
                                            <span>{task.assignee?.name || "-"}</span>
                                        </div>
                                    </td>

                                    <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#71717a" }}>
                                            <CalendarIcon size={14} />
                                            {format(new Date(task.due_date), "dd MMM yyyy")}
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#71717a" }}>
                                    No tasks found for the selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectTasks;