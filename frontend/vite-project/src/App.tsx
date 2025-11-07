import { Route, Routes, Outlet } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Navbar from './component/Navbar'

// This component will act as a layout for the protected routes
const AppLayout = () => (
    <div>
        <Navbar />
        <Outlet /> {/* Child routes will render here */}
    </div>
);

function App() {
    return (
        <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route element={<AppLayout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<Orders />} />
            </Route>
        </Routes>
    )
}
export default App
