import axios from "axios"
import { useState, type ChangeEvent } from "react"
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link

const backend = import.meta.env.VITE_BACKEND_URL

export default function Signup() {
    const [form, setForm] = useState({ username: '', email: '', password: '', address: '' })
    const navigate = useNavigate(); // Initialize useNavigate

    const onclickhandler =async () => {
        console.log(form)
        try {
            const response = await axios.post(`${backend}/auth/signup`, { ...form });
            console.log(response);
            // After successful signup, you might want to automatically sign them in or redirect to signin page
            // For now, let's just clear the form and redirect to signin
            setForm({ username: '', email: '', password: '', address: '' });
            navigate("/signin"); // Redirect to signin page
        } catch (error) {
            console.error("Sign-up failed:", error);
            // Optionally, display an error message to the user
        }
    }
    const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create your Account
                </h2>
                <form className="space-y-4">
                {["username", "email", "password", "address"].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="sr-only">{field}</label>
                            <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                type={field === "password" ? "password" : "text"}
                                placeholder={`Enter your ${field}`}
                                name={field}
                                value={(form as any)[field]}
                                onChange={handleOnchange}
                                id={field}
                                required={true} />
                        </div>
                ))}
                </form>
                <button type="submit" onClick={onclickhandler} className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200">Sign Up</button>
                <p className="mt-6 text-center text-sm text-gray-600">Already a user? <Link to="/signin" className="font-medium text-yellow-600 hover:text-yellow-500">Login</Link></p>
            </div>
        </div>
    )
}