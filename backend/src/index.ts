import express, { type NextFunction, type Request, type Response } from "express"
import { UserSignup, UserSignin, CartItemSchema } from "./zod" // Renamed Z_cart to CartItemSchema for clarity
import dotenv from 'dotenv'
dotenv.config(); 

import bcrypt from 'bcrypt'
import cors from 'cors'
import mongoose from "mongoose"
import { user, cart, product } from "../utilty/schema"
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { mockProducts } from '../mock/mock_data'
const db = process.env.VITE_DB;

const app = express()
const port = process.env.PORT || 3000; // Use PORT or default to 3000
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10'); // Use SALT_ROUNDS or default to 10
app.use(express.json())

// Extend the Request interface to include userid
declare global {
    namespace Express {
        interface Request {
            userid?: string;
        }
    }
}

// Use an async IIFE for top-level await for Mongoose connection
(async () => {
    if (!db) { console.error("DATABASE_URI environment variable not found. Please set it in your .env file."); process.exit(1); }
    else {
        await mongoose.connect(db).then(() => console.log("MongoDB connected successfully")).catch((e) => console.error("MongoDB connection error:", e));
    }
})(); // Call the async IIFE
app.use(cors())

//-------------------play-ground-----------------------

//middilware 
const auth=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers["authorization"]; // Standard Authorization header
    const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if (!token) {
        return res.status(401).json({message:'Authentication required: No token provided'})
    }
    try {
        const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token; 
        const secret = process.env.JWT_SECRET || "jwt_secret";
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables.');
        }
        const decoded = jwt.verify(tokenValue, secret) as JwtPayload;
        req.userid = decoded.userid;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
}
//
app.post("/auth/Signup",async (req, res) => {
    try {
        const parsed = UserSignup.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid credential format", issues: parsed.error.issues });
        }

        const { username, password, email, address } = parsed.data;
        const hash_password = await bcrypt.hash(password, saltRounds);
        const createUser = await user.create({ username, password: hash_password, email, address });

        res.status(201).json({ message: 'User created successfully', userId: createUser._id });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: (error as Error).message });
    }

})
app.post("/auth/Signin", async (req, res) => {
    const parsed = UserSignin.safeParse(req.body)
    if (!parsed.success) {
        return res.status(404).json({ message: "invalid credentials" })
    }
    let { password, email } = req.body
    const findUser = await user.findOne({ email })
    if (!findUser) {
        return res.status(401).json({ message: "Authentication failed: User not found" });
    }

    if (typeof password === "string" && await bcrypt.compare(password, findUser.password)) {
        const secret = process.env.JWT_SECRET ||"jwt_secret";
        if (!secret) {
            return res.status(500).json({ message: 'Server configuration error: JWT secret not set.' });
        }
        const token = jwt.sign({ userid: findUser._id }, secret, { expiresIn: '1h' }); // Add token expiration
        return res.json({ userid: findUser._id, token });
    } else {
        res.status(401).json({ message: "Authentication failed: Invalid password" })
    }
})
app.get('/api/product', async (req, res) => { //get all product
    const response = await product.find()
    res.status(200).json(response)
})
app.get('/api/cart/',auth, async (req, res) => { //get cart product
    const userId = req.userid;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }
    const response = await cart.find({ user: userId });
    res.status(200).json(response);
})

app.post('/api/cart',auth, async (req, res) => { //add product to cart
    const parsed = CartItemSchema.safeParse(req.body);
    console.log(parsed.data + req.body)
    if (!parsed.success) { 
        return res.status(400).json({ message: 'Invalid product data', issues: parsed.error.issues }); }

    const { productId, quntity } = parsed.data; // Assuming CartItemSchema validates productId and quntity
    const userId = req.userid; // Get userId from auth middleware

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Find the product to ensure it exists and get its details (price, name, image)
    const productDetails = await product.findOne({ productId: productId }); // Assuming productId is unique
    if (!productDetails) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    const find_in_cart = await cart.findOne({ productId, user: userId });
    if (find_in_cart) {
        const response = await cart.findOneAndUpdate(
            { productId, user: userId },
            { $inc: { quntity: quntity || 1 } }, // Corrected to 'quntity' to match schema
            { new: true }
        )
        return res.status(200).json({ message: "quntity updated" })

    } else {
        // This else block seems to have an incomplete thought, the logic below handles creation.
    }  //here userid have to be
    // Create new cart item
    const newCartItem = await cart.create({
        productId: productDetails.productId,
        productImage: productDetails.productImage,
        productName: productDetails.productName,
        price: productDetails.price,
        quntity: quntity || 1, // Corrected to 'quntity' to match schema
        user: userId,
    });
    return res.status(201).json({ message: "Product added to cart successfully", item: newCartItem });
})

app.post('/api/products',async (req, res) => {
    try {
        const createdProducts: any[] = [];
        for (const productData of mockProducts) {
            const created = await product.create(productData);
            createdProducts.push(created);
        }
        res.status(201).json({ message: "Products created", products: createdProducts });
    } catch (error) {
        res.status(500).json({ message: "Error creating products", error });
    }
})
app.delete('/api/cart/:productId', auth, async (req, res) => { //del product from cart
    const { productId } = req.params;
    const userId = req.userid;

    const deletedItem = await cart.findOneAndDelete({ productId: productId, user: userId });

    if (deletedItem) {
        res.status(200).json({ message: "Item removed from cart", deletedItem });
    } else {
        res.status(404).json({ message: "Item not found in cart" });
    }
})

// New Endpoint: /api/checkout POST
app.post('/api/checkout', auth, async (req, res) => {
    const userId = req.userid;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const userCartItems = await cart.find({ user: userId });
        if (userCartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }

        let total = 0;
        userCartItems.forEach(item => {
            total += item.price * item.quntity; // Corrected to 'quntity' to match schema
        });

        // Simulate clearing the cart after checkout
        await cart.deleteMany({ user: userId });

        res.status(200).json({
            message: 'Checkout successful!',
            receipt: { total: total.toFixed(2), timestamp: new Date().toISOString(), items: userCartItems }
        });
    } catch (error) {
        res.status(500).json({ message: "Checkout failed", error: (error as Error).message });
    }
})

app.listen(port, () => {
    console.log(port + " at backend is listening")
})