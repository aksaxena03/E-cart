import {z} from "zod"

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
const CartItemSchema=z.object({
    productId:z.string().min(1),
    quntity:z.number().int().min(1).optional().default(1)
})

export {UserSignin,UserSignup,CartItemSchema}