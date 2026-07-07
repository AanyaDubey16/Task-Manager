function CompletedCard({ task, onUndo, onDelete }) {
  return (
    <div className="bg-white/70 rounded-3xl border p-5 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold line-through text-gray-400">
          {task.title}
        </h3>

        <p className="text-gray-500">{task.description}</p>

        <p className="text-sm text-gray-400 mt-2">
          Completed on {task.completedDate}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUndo(task)}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl"
        >
          Undo
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CompletedCard;