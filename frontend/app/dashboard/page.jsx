"use client"

import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import SummaryCard from "./components/SummaryCard"
import DistributionChart from "./components/DistributionChart"
import TrendChart from "./components/TrendChart"
import EEGChart from "./components/EEGChart"
import StressChart from "./components/StressChart"
import CorrelationChart from "./components/CorrelationChart"
import RecordsTable from "./components/RecordsTable"

export default function DashboardPage() {
    const [data, setData] = useState(null)
    const [activeView, setActiveView] = useState("summary")

    useEffect(() => {
        const stored = localStorage.getItem("predictionData")
        if (stored) {
            setData(JSON.parse(stored))
        }
    }, [])

    if (!data) {
        return (
            <div className="text-center py-20 text-gray-500">
                No prediction data found.
            </div>
        )
    }

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
            />

            {/* Main Content */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg min-h-125">

                {activeView === "summary" && (
                    <SummaryCard summary={data.session_summary} />
                )}

                {activeView === "distribution" && (
                    <DistributionChart
                        distribution={data.visual_data.distribution}
                    />
                )}

                {activeView === "trend" && (
                    <TrendChart
                        trend={data.visual_data.trend}
                    />
                )}

                {activeView === "eeg" && (
                    <EEGChart
                        eeg={data.visual_data.eeg_mean}
                    />
                )}

                {activeView === "stress" && (
                    <StressChart
                        stress={data.visual_data.stress_mean}
                    />
                )}

                {activeView === "correlation" && (
                    <CorrelationChart
                        correlation={data.visual_data.correlation}
                    />
                )}

                {activeView === "records" && (
                    <RecordsTable
                        records={data.records}
                        fileName={data.file_name}
                        fileData={data.file_data}
                    />
                )}

            </div>
        </div>
    )
}