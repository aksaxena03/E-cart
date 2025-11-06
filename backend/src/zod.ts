import { password } from "bun"
import {z} from "zod"
import { product } from "../utilty/schema";

const UserSignup= z.object({
    username:z.string(),
    email:z.string().email(),
    password:z.string(),
    address:z.string()
});
const UserSignin=z.object({
    email:z.string().email(),
    password:z.string()
})
const Z_cart=z.object({
    productId:z.string(),
    productName:z.string(),
    price:z.number(),
    quntity:z.number()
})

export {UserSignin,UserSignup,Z_cart}