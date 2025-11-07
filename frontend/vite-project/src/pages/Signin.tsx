import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"; // Import useNavigate

const backend = import.meta.env.VITE_BACKEND_URL

export default function Signin() {
    const [form, setForm] = useState({ email: '', password: '' })
    const navigate = useNavigate(); // Initialize useNavigate

    const onclickhandler =async () => {
        console.log(form)
        try {
            const response = await axios.post(`${backend}/auth/Signin`, { ...form });
            console.log(response);
            localStorage.setItem("token", response.data.token); // Store the token
            localStorage.setItem("userId", response.data.userid); // Store userId if needed
            setForm({ email: '', password: '' }); // Clear form
            navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("Sign-in failed:", error);
            // Optionally, display an error message to the user
        }
    }
    const handleOnchange = (e: any) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign In to E-cart
                </h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            type="email" placeholder="Enter your email" name="email" value={form.email} onChange={handleOnchange} id="email" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            type="password" placeholder="Enter your password" name="password" value={form.password} onChange={handleOnchange} id="password" required />
                    </div>
                </form>
                <button type="submit" onClick={onclickhandler} className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200">Sign In</button>
                <p className="mt-6 text-center text-sm text-gray-600">
                    New user? <a href="/signup" className="font-medium text-yellow-600 hover:text-yellow-500">Create an account</a>
                </p>
            </div>
        </div>
    )
}