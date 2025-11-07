import axios from "axios";
import { X } from 'lucide-react';
const backend = import.meta.env.VITE_BACKEND_URL;
interface Cardprop{
    productId: string;
    productImage: string;
    productName: string;
    price: number;
    quntity: number;
    onRemove: () => void; // Callback to refetch cart items
}
export default function Cart_card(props:Cardprop){
  const onclickhandler = async () => {
    try {
        const response = await axios.delete(`${backend}/api/cart/${props.productId}`, // Use productId as URL parameter
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } // config with headers, no data in body for DELETE with param
            }
        );
        console.log("Item removed from cart:", response.data);
    } catch (error) {
        console.error("Error removing item from cart:", error);
    }
};
    return(
        <div className="w-full bg-white rounded-lg shadow-md flex items-center p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32">
                <img className="w-full h-full object-cover rounded-md" src={props.productImage} alt={props.productName} />
            </div>
            <div className="sm:px-6 px-4">
                <h3 className="font-bold text-md sm:text-lg text-gray-800">{props.productName}</h3>
                <p className="text-sm text-gray-600 mt-1">Quantity: {props.quntity}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">${(props.price).toFixed(2)}</p>
            </div>
            <div className="ml-auto">
                <button 
                    type="button" 
                    onClick={onclickhandler} 
                    className="text-gray-400 hover:text-red-500 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                    aria-label="Remove item">
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}