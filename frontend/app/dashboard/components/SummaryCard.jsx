"use client"

export default function SummaryCard({ summary }) {
    const cards = [
        { label: "Total Samples", value: summary.total_rows },
        { label: "Seizure Cases", value: summary.seizure_count },
        { label: "Non-Seizure", value: summary.non_seizure_count },
        { label: "Seizure %", value: summary.seizure_percentage + "%" },
        { label: "Avg EEG Mean", value: summary.avg_eeg_mean.toFixed(2) },
        { label: "Avg Stress Mean", value: summary.avg_stress_mean.toFixed(2) },
        { label: "Processing Time", value: summary.processing_time + "s" }
    ]

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Session Overview</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg transform transition hover:scale-105 hover:shadow-2xl duration-300"
                    >
                        <p className="text-sm opacity-80">{card.label}</p>
                        <h3 className="text-2xl font-bold mt-2">
                            {card.value}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}