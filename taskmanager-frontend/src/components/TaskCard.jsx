import { CheckCircle2, Trash2, CalendarDays, Flag, Pencil } from "lucide-react";

function TaskCard({ task, onComplete, onDelete, onEdit }) {
  const priorityStyle = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
          <p className="text-gray-500 mt-1">{task.description || "No description"}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${
                priorityStyle[task.priority] || priorityStyle.Medium
              }`}
            >
              <Flag size={14} />
              {task.priority || "Medium"}
            </span>

            {task.dueDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200">
                <CalendarDays size={14} />
                Due: {task.dueDate}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onEdit(task)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onComplete(task)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
          >
            <CheckCircle2 size={16} />
            Complete
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;