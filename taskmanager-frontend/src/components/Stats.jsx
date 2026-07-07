import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Flame,
} from "lucide-react";

function Stats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  const cards = [
    {
      title: "Total Tasks",
      value: total,
      icon: <ClipboardList size={28} />,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock3 size={28} />,
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle2 size={28} />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "High Priority",
      value: highPriority,
      icon: <Flame size={28} />,
      color: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border"
        >
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-5`}
          >
            {card.icon}
          </div>

          <p className="text-gray-500 text-sm">{card.title}</p>

          <h2 className="text-4xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default Stats;