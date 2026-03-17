"use client"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold mb-4">
        EEG Cognitive Seizure Classification System
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Stress-Integrated Machine Learning Framework
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => router.push("/auth")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Login / Register
        </button>

        <button
          onClick={() => {
            localStorage.setItem("mode", "guest")
            router.push("/upload")
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}