import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, CreditCard, Package } from 'lucide-react';
import { useEffect, } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/cart', label: 'Cart', icon: <ShoppingCart size={20} /> },
        { path: '/checkout', label: 'Checkout', icon: <CreditCard size={20} /> },
        { path: '/orders', label: 'Orders', icon: <Package size={20} /> },
        
        
    ]; 
    useEffect (() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // If no token, redirect to signin page
            navigate('/signin');
            return;
        }
    }, [navigate]);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/dashboard" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
                            E-Cart
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        location.pathname === item.path
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// { path: '/Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
// { path: '/Cart', label: 'Cart', icon: <ShoppingCart size={20} /> },
// { path: '/Checkout', label: 'Checkout', icon: <CreditCard size={20} /> },
// { path: '/Orders', label: 'Orders', icon: <Package size={20} /> },