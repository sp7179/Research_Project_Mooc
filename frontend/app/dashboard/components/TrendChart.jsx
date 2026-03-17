"use client"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export default function TrendChart({ trend }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                Seizure Trend Over Time
            </h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="prediction"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                            activeDot={{ r: 8 }}
                            animationDuration={1200}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}