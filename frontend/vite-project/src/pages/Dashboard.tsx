import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../component/Card";

const backend = import.meta.env.VITE_BACKEND_URL;

interface Product {
    _id: string;
    productId: string;
    productImage: string;
    productName: string;
    price: number;
    quntity: number;
}

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${backend}/api/product`);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch products.");
                setLoading(false);
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading products...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return(
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => <Card key={product._id} {...product} />)}
            </div>
        </div>
        </div>
    )
}