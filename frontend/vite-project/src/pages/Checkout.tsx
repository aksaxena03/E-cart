import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backend = import.meta.env.VITE_BACKEND_URL;



export default function Checkout() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin');
                return;
            }

             await axios.post(
                `${backend}/api/checkout`,
                { formData }, // Pass form data in the request body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // On success, navigate to the orders page
            navigate('/orders');
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during checkout.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Shipping Address</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" required></textarea>
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-blue-300">
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}