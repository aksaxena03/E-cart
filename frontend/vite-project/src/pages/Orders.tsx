import { useEffect, useState } from "react";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

interface OrderItem {
    productImage: string;
    productName: string;
    price: number;
    quntity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    orderDate: string;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You must be logged in to view orders.");
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`${backend}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading your orders...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
                {orders.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-600">You have no past orders.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order Placed</p>
                                        <p className="font-medium text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.productName}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quntity}</p>
                                            </div>
                                            <p className="ml-auto font-medium text-gray-700">${(item.price * item.quntity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}