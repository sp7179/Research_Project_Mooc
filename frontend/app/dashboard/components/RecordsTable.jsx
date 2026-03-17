"use client"

export default function RecordsTable({ records, fileName, fileData }) {

    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = `data:text/csv;base64,${fileData}`
        link.download = fileName || "prediction_output.csv"
        link.click()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    Prediction Records
                </h2>

                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Download CSV
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Prediction</th>
                                <th className="px-6 py-3">Label</th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {row.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.timestamp}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.prediction}
                                    </td>
                                    <td
                                        className={`px-6 py-4 font-semibold ${row.prediction === 1
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {row.prediction_label}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}