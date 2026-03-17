"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const router = useRouter()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: isLogin ? "login" : "register",
                    ...formData
                })
            })
            const data = await res.json()

            if (!res.ok) {
                alert(data.detail || "Something went wrong")
                return
            }

            if (isLogin) {
                localStorage.setItem("token", data.access_token)
                router.push("/upload")
            } else {
                alert("Registration successful. Please login.")
                setIsLogin(true)
            }
        } catch (err) {
            alert("Server error")
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isLogin ? "Login" : "Register"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-600 cursor-pointer hover:underline"
                >
                    {isLogin ? "Register" : "Login"}
                </span>
            </p>
        </div>
    )
}