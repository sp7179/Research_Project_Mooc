"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

export default function DistributionChart({ distribution }) {
    const data = [
        { name: "Seizure", value: distribution.seizure },
        { name: "Non-Seizure", value: distribution.non_seizure }
    ]

    const COLORS = ["#ef4444", "#22c55e"]

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Prediction Distribution</h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1200}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}