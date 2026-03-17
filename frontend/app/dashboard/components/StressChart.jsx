"use client"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export default function StressChart({ stress }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                Stress Mean Distribution
            </h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="stress_mean"
                            fill="#7c3aed"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}