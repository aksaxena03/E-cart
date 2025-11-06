import express, { type NextFunction, type Request, type Response } from "express"
import { UserSignup, UserSignin, Z_cart } from "./zod"
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import mongoose from "mongoose"
import { user, cart, product } from "../utilty/schema"
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { mockProducts } from '../mock/mock_data'
import { _isoDateTime } from "zod/v4/core"
const db = process.env.VITE_DB;
if (!db) { console.log("database not found") }
else {
    await mongoose.connect(db).then(() => console.log("db is up")).catch((e) => console.log(e))
}
const app = express()
const port = process.env.VITE_PORT
const salt = process.env.VITE_SALT
app.use(express.json())


//-------------------play-ground-----------------------

//middilware 
const auth=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers["authorization"]
    if(!token){
        return res.status(404).json({message:'you need to login '})
    }
    const decode =jwt.verify(token,process.env.VITE_JWT as string ) as JwtPayload 
   if(!decode){
    res.status(404).json({message:'indvalid creadential, login agin'})
   }
    //@ts-ignore
    req.userid=decode.userid
    next()
}
//
app.post("/auth/Signup",async (req, res) => {
    const parsed = UserSignup.safeParse(req.body)
    console.log(parsed.data)
    if (!parsed.success) {
        return res.status(404).json({ message: "invalid creadential" })
    }
    let { username, password, email, address } = req.body
    let hash_password = await bcrypt.hash(password as string, salt || 10)
    const createUser = await user.create({ username, password: hash_password, email, address })
    console.log(createUser)
    res.status(200).json({ message: 'created' })
    if (!createUser) {
        res.status(404).json({ message: "sigup fail in db" })
    }

})
app.post("/auth/Signin", async (req, res) => {
    const parsed = UserSignin.safeParse(req.body)
    if (!parsed.success) {
        return res.status(404).json({ message: "invalid credentials" })
    }
    let { password, email } = req.body
    const findUser = await user.findOne({ email })
    if (findUser && typeof password === "string" && await bcrypt.compare(password, findUser.password)) {
        const token = jwt.sign({ userid: findUser._id }, process.env.VITE_JWT as string);
        return res.json({ userid: findUser._id, token })
    } else {
        res.status(401).json({ message: "auth failed" })
    }
})
app.get('/api/product', async (req, res) => { //get all product
    const response = await product.find()
    res.status(200).json({ ...response })
})
app.get('/api/cart/',auth, async (req, res) => { //get cart product
    const { userid } = req.body //userid
    const response = await cart.find({ userid })
    res.status(200).json({ ...response })
})

app.post('/api/cart',auth, async (req, res) => { //add product to cart
    const parsed = Z_cart.safeParse(req.body)
    console.log(parsed.data, req.body)
    if (!parsed.success) { return res.status(404).json({ message: 'invalid product' }) }
    const find_in_cart = await cart.findOne({ productId: parsed.data.productId })
    if (find_in_cart) {
        const response = await cart.findOneAndUpdate(
            { productId: parsed.data.productId },
            { $inc: { quantity: parsed.data.quntity } },
            { new: true }
        )
        return res.status(200).json({ message: "quantity updated" })

    } else {
        const carting = await cart.create({ ...parsed.data, user: req.body.userid })
    }  //here userid have to be
    return res.status(200).json({ message: "product added successfully" })// from middileware
})
app.post('/api/products', auth,async (req, res) => {
    try {
        const createdProducts = await Promise.all(
            mockProducts.map((productData: typeof mockProducts[0]) => product.create(productData))
        );
        res.status(201).json({ message: "Products created", products: createdProducts });
    } catch (error) {
        res.status(500).json({ message: "Error creating products", error });
    }
})
app.delete('/api/cart/', auth,async (req, res) => { //del product from cart
    const { productName, productId ,userid} = req.body;
    const deletedItem = await cart.findOneAndDelete({ productId, productName,user:userid });
    if (deletedItem) {
        res.status(200).json({ message: "Item deleted", deletedItem });
    } else {
        res.status(404).json({ message: "Item not found" });
    }
})

app.listen(port, () => {
    console.log(port + " at backend is listening")
})