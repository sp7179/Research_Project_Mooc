"use client"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.clear()
        router.push("/")
    }

    return (
        <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
            <div>
                <h2
                    onClick={() => router.push("/")}
                    className="text-lg font-semibold cursor-pointer"
                >
                    EEG System
                </h2>
            </div>

            <div className="flex gap-4">
                {pathname !== "/" && (
                    <button
                        onClick={() => router.back()}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                    >
                        Back
                    </button>
                )}

                <button
                    onClick={() => router.push("/upload")}
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    Upload
                </button>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 transition"
                >
                    Dashboard
                </button>

                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}