function AddTask({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  isEditing,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6 mb-8">
      <input
        className="w-full border rounded-2xl p-4 mb-3 outline-none"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded-2xl p-4 mb-3 outline-none"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <select
          className="border rounded-2xl p-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="date"
          className="border rounded-2xl p-4"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button
        onClick={addTask}
        className={`w-full text-white rounded-2xl py-4 font-semibold ${
          isEditing ? "bg-green-600" : "bg-black"
        }`}
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>
    </div>
  );
}

export default AddTask;