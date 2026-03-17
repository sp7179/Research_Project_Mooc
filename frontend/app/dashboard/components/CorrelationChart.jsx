"use client"
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

export default function CorrelationChart({ correlation }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">
                EEG vs Stress Correlation
            </h2>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="eeg_mean"
                            name="EEG Mean"
                        />
                        <YAxis
                            type="number"
                            dataKey="stress_mean"
                            name="Stress Mean"
                        />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter
                            data={correlation}
                            fill="#7c3aed"
                            animationDuration={1200}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}