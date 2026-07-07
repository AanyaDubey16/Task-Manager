import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  CalendarClock,
  Share2,
  Settings,
} from "lucide-react";

function Sidebar({ activeTab, setActiveTab }) {
const menu = [
  { icon: <LayoutDashboard size={22} />, title: "Dashboard" },
  { icon: <CheckSquare size={22} />, title: "To Do" },
  { icon: <CalendarDays size={22} />, title: "Today" },
  { icon: <CalendarClock size={22} />, title: "Tomorrow" },
  { icon: <CheckSquare size={22} />, title: "Completed" },
  { icon: <Share2 size={22} />, title: "Shared Views" },
  { icon: <Settings size={22} />, title: "Settings" },
];


  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r min-h-screen p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-8">TaskFlow</h1>

      <div className="space-y-3">
        {menu.map((item) => (
          <button
            key={item.title}
            onClick={() => setActiveTab(item.title)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg transition-all ${
              activeTab === item.title
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-indigo-50"
            }`}
          >
            {item.icon}
            {item.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;