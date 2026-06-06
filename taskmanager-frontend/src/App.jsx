import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const API = "http://localhost:8080/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (error) {
      console.log("Fetch Error:", error);
      alert("Backend running nahi hai. Pehle Spring Boot start karo.");
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      await axios.post(API, {
        title: title,
        description: description || "",
        completed: false,
        priority: "Medium",
        dueDate: "",
      });

      setTitle("");
      setDescription("");
      await fetchTasks();
    } catch (error) {
      console.log("Add Error:", error);
      alert("Task add nahi hua. Backend/API check karo.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      await fetchTasks();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API}/${task.id}`, {
        id: task.id,
        title: task.title,
        description: task.description || "",
        completed: !task.completed,
        priority: task.priority || "Medium",
        dueDate: task.dueDate || "",
      });

      await fetchTasks();
    } catch (error) {
      console.log("Update Error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = tasks.filter((task) => {
    const taskTitle = task.title || "";
    const taskDescription = task.description || "";

    const matchesSearch =
      taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      taskDescription.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Task Manager
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-gray-500">Total</h2>
            <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-gray-500">Completed</h2>
            <p className="text-3xl font-bold text-green-600">{completed}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <h2 className="text-gray-500">Pending</h2>
            <p className="text-3xl font-bold text-orange-500">{pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <input
            className="w-full border rounded-xl p-3 mb-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-xl p-3 mb-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="button"
            onClick={addTask}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Add Task
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 border rounded-xl p-3 text-gray-800 outline-none"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl p-3 text-gray-800 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
            >
              <div>
                <h3
                  className={`text-xl font-semibold ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>

                <p className="text-gray-500">{task.description}</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleComplete(task)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
                >
                  {task.completed ? "Undo" : "Done"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <p className="text-center mt-8 text-lg text-gray-700">
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
}

export default App;