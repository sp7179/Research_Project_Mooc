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

export default function EEGChart({ eeg }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                EEG Mean Distribution
            </h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={eeg}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="eeg_mean"
                            fill="#2563eb"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1200}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}