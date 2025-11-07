import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

interface CardProps {
    productId: string;
    productImage: string;
    productName: string;
    price: number;
    quntity: number;
}
export default function Card(props: CardProps) {
    const onclickhandler = async () => {
        try {
            const response = await axios.post(`${backend}/api/cart`,
                { productId: props.productId, 
                    quntity: props.quntity,
                    productName:props.productImage,
                    price:props.price
                 }, // data, assuming default quantity is 1
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } } // config with headers
            );
            console.log("Item added to cart:", response.data);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
            <div className="relative w-full" style={{ paddingTop: '100%' }}> {/* Aspect ratio container */}
                <img className="absolute top-0 left-0 w-full h-full object-cover" src={props.productImage} alt={props.productName} />
            </div>
            <div className="p-4 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-gray-800 truncate">{props.productName}</h3>
                <p className="text-gray-600 text-sm mb-2">In Stock: {props.quntity}</p>
                
                <div className="mt-auto">
                    <p className="text-xl font-bold text-gray-900 mb-3">
                        ${(props.price * props.quntity).toFixed(2)}
                    </p>
                    <button 
                        type="button" 
                        onClick={onclickhandler} 
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}