"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadForm() {
    const [file, setFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === "text/csv") {
            setFile(droppedFile)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!file) {
            alert("Please select a CSV file")
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Upload failed")
                setLoading(false)
                return
            }

            // store response for dashboard
            localStorage.setItem("predictionData", JSON.stringify(data))

            setLoading(false)
            router.push("/dashboard")

        } catch (error) {
            alert("Server error")
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Upload EEG CSV File
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${isDragging
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 bg-gray-50"
                        }`}
                >
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileUpload"
                    />

                    <label htmlFor="fileUpload" className="cursor-pointer">
                        <p className="text-gray-600">
                            Drag & Drop CSV file here
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            or click to browse
                        </p>
                    </label>
                </div>

                {file && (
                    <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
                        Selected: <span className="font-medium">{file.name}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        "Process File"
                    )}
                </button>
            </form>
        </div>
    )
}