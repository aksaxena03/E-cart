interface CartItem {
    productName: string;
    price: number;
    quntity: number;
}

interface Receipt {
    total: string;
    timestamp: string;
    items: CartItem[];
}

interface ReceiptModalProps {
    receipt: Receipt;
    onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Checkout Successful!</h2>
                <div className="border-t border-b py-4 my-4">
                    <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                    <p className="text-sm text-gray-600">Date: {new Date(receipt.timestamp).toLocaleString()}</p>
                    <div className="mt-4 space-y-2">
                        {receipt.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <span>{item.productName} (x{item.quntity})</span>
                                <span>${(item.price * item.quntity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
                        <span>Total</span>
                        <span>${receipt.total}</span>
                    </div>
                </div>
                <div className="text-center">
                    <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}