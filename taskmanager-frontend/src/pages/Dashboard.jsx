import { useEffect, useState } from "react";
import api from "../services/api";
import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";
import CompletedCard from "../components/CompletedCard";
import Stats from "../components/Stats";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const today = new Date().toISOString().split("T")[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = tomorrowObj.toISOString().split("T")[0];

  const shareLink = `${window.location.origin}/shared/tasks`;

  const fetchTasks = async () => {
    try {
      const res = await api.get("");
      setTasks(res.data);
    } catch (error) {
      console.log("Fetch error:", error);
      alert("Backend/API connect nahi ho raha");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setEditId(null);
  };

  const addTask = async () => {
    if (!title.trim()) return alert("Enter task title");

    await api.post("", {
      title,
      description,
      priority,
      dueDate,
      completed: false,
      sharedView: "My Tasks",
      accessType: "Edit",
      editedBy: "Aanya",
      completedBy: "",
    });

    resetForm();
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTask = async () => {
    if (!title.trim()) return alert("Enter task title");

    const oldTask = tasks.find((task) => task.id === editId);

    await api.put(`/${editId}`, {
      ...oldTask,
      title,
      description,
      priority,
      dueDate,
      editedBy: "Aanya",
    });

    resetForm();
    fetchTasks();
  };

  const completeTask = async (task) => {
    await api.put(`/${task.id}`, {
      ...task,
      completed: true,
      completedBy: "Aanya",
    });

    fetchTasks();
  };

  const undoTask = async (task) => {
    await api.put(`/${task.id}`, {
      ...task,
      completed: false,
      completedBy: "",
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/${id}`);
    fetchTasks();
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Share link copied!");
  };

  const setShareAccess = async (accessType) => {
    for (const task of tasks) {
      await api.put(`/${task.id}`, {
        ...task,
        sharedView: "My Tasks",
        accessType,
      });
    }
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredActiveTasks = tasks.filter((task) => {
    const taskTitle = task.title || "";
    const taskDescription = task.description || "";

    const matchesSearch =
      taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      taskDescription.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "High" && task.priority === "High") ||
      (filter === "Medium" && task.priority === "Medium") ||
      (filter === "Low" && task.priority === "Low");

    return !task.completed && matchesSearch && matchesFilter;
  });

  const todayTasks = filteredActiveTasks.filter((task) => task.dueDate === today);
  const tomorrowTasks = filteredActiveTasks.filter(
    (task) => task.dueDate === tomorrow
  );

  const completedTasks = tasks.filter((task) => task.completed);

  const groupedCompleted = completedTasks.reduce((groups, task) => {
    const date = task.completedDate || "Unknown Date";
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  const formatDate = (date) => {
    if (date === today) return "Today";
    if (date === tomorrow) return "Tomorrow";
    if (date === "Unknown Date") return "Completed";
    return new Date(date).toDateString();
  };

  const renderTaskList = (list, emptyText) => (
    <div className="space-y-3">
      {list.length === 0 ? (
        <p className="text-gray-500">{emptyText}</p>
      ) : (
        list.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={completeTask}
            onDelete={deleteTask}
            onEdit={startEdit}
          />
        ))
      )}
    </div>
  );

  return (
    <div className="flex bg-[#f7f4ef] min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 md:p-10">
        <Header />

        {activeTab === "Dashboard" && <Stats tasks={tasks} />}

        {(activeTab === "Dashboard" || activeTab === "To Do") && (
          <AddTask
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            dueDate={dueDate}
            setDueDate={setDueDate}
            addTask={editId ? updateTask : addTask}
            isEditing={editId !== null}
          />
        )}

        {(activeTab === "Dashboard" || activeTab === "To Do") && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="Search tasks..."
                className="flex-1 p-3 rounded-xl border outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="p-3 rounded-xl border"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">To Do</h2>
              {renderTaskList(filteredActiveTasks, "No active tasks")}
            </section>
          </>
        )}

        {activeTab === "Today" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Today</h2>
            {renderTaskList(todayTasks, "No tasks for today")}
          </section>
        )}

        {activeTab === "Tomorrow" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Tomorrow</h2>
            {renderTaskList(tomorrowTasks, "No tasks for tomorrow")}
          </section>
        )}

        {(activeTab === "Dashboard" || activeTab === "Completed") && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Completed</h2>

            {Object.keys(groupedCompleted).length === 0 && (
              <p className="text-gray-500">No completed tasks</p>
            )}

            {Object.keys(groupedCompleted).map((date) => (
              <div key={date} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-600">
                  {formatDate(date)}
                </h3>

                <div className="space-y-3">
                  {groupedCompleted[date].map((task) => (
                    <CompletedCard
                      key={task.id}
                      task={task}
                      onUndo={undoTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "Shared Views" && (
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2">Shared Views</h2>
            <p className="text-gray-500 mb-6">
              Create a shareable view of your tasks with read-only or edit access.
            </p>

            <div className="bg-gray-50 border rounded-2xl p-5 mb-5">
              <p className="text-sm text-gray-500 mb-2">Share Link</p>
              <div className="flex gap-3">
                <input
                  value={shareLink}
                  readOnly
                  className="flex-1 border rounded-xl p-3 bg-white"
                />
                <button
                  onClick={copyShareLink}
                  className="bg-indigo-600 text-white px-5 rounded-xl"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShareAccess("Read Only")}
                className="bg-gray-900 text-white px-5 py-3 rounded-xl"
              >
                Set Read Only
              </button>

              <button
                onClick={() => setShareAccess("Edit")}
                className="bg-green-600 text-white px-5 py-3 rounded-xl"
              >
                Set Edit Access
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-2xl p-4 bg-gray-50"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Access: {task.accessType || "Edit"} | Shared View:{" "}
                    {task.sharedView || "My Tasks"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Edited By: {task.editedBy || "Aanya"} | Completed By:{" "}
                    {task.completedBy || "Not completed"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="bg-white rounded-3xl border p-8 shadow-sm">
            <h2 className="text-3xl font-bold mb-2">Settings</h2>
            <p className="text-gray-500">
              Dark mode and user preferences will be added next.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;