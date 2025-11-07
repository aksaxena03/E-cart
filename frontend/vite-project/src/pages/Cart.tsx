import { useEffect, useState } from "react";
import axios from "axios";
import Cart_card from "../component/Cart_card";
import { useNavigate } from "react-router-dom";

const backend = import.meta.env.VITE_BACKEND_URL;

interface Product {
    _id: string;
    productId: string;
    productImage: string;
    productName: string;
    price: number;
    quntity: number;
}

export default function Cart() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backend}/api/cart`,{
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setProducts(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch cart items.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // If no token, redirect to signin page
            navigate('/signin');
            return;
        }
        fetchProducts();
    }, [navigate]);
    const onclickhandler = async () => {
        navigate('/checkout');
    }

    if (loading) return <div className="text-center mt-10">Loading Cart...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return(
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>
                <div className="flex flex-col gap-4">
                {products.map(product => <Cart_card key={product._id} {...product} onRemove={fetchProducts} />)}
            </div>
            </div>
            <button 
                type="button" 
                onClick={onclickhandler} 
                className="w-full bg-yellow-400 px hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                Checkout
            </button>
        </div>
    )
}