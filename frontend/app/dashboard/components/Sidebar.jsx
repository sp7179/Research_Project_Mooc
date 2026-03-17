"use client"

import {
    BarChart3,
    PieChart,
    TrendingUp,
    Activity,
    Brain,
    Table2
} from "lucide-react"

export default function Sidebar({ activeView, setActiveView }) {
    const menu = [
        { key: "summary", label: "Summary", icon: <BarChart3 size={18} /> },
        { key: "distribution", label: "Distribution", icon: <PieChart size={18} /> },
        { key: "trend", label: "Trend", icon: <TrendingUp size={18} /> },
        { key: "eeg", label: "EEG Analysis", icon: <Brain size={18} /> },
        { key: "stress", label: "Stress Analysis", icon: <Activity size={18} /> },
        { key: "correlation", label: "Correlation", icon: <BarChart3 size={18} /> },
        { key: "records", label: "Records", icon: <Table2 size={18} /> }
    ]

    return (
        <div className="w-64 bg-slate-900 text-white rounded-2xl shadow-xl p-6 flex flex-col">

            <h2 className="text-xl font-bold mb-8 tracking-wide">
                Dashboard
            </h2>

            <div className="space-y-3">
                {menu.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveView(item.key)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${activeView === item.key
                                ? "bg-linear-to-r from-blue-600 to-indigo-600 shadow-lg scale-105"
                                : "hover:bg-slate-800 hover:scale-105"
                            }`}
                    >
                        {item.icon}
                        <span className="text-sm font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-auto pt-8 text-xs text-gray-400">
                Cognitive AI v1.0
            </div>

        </div>
    )
}