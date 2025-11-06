import mongoose from "mongoose"
import { required } from "zod/mini"
const userSchema=new mongoose.Schema(
    {  
        username:{
            type:String,
            required:[true,"username is required"],
            trim:true,
            minlength:3,
            maxlength:30,
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
            lowcase:true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        password:{
            type:String,
            required:[true,"password is required"],
            minlength:6,
            NotNull:true
        },address:{
            type:String,
            requred:[true,"address. is required"],
            minlength:7,maxlenght:30
        },
        createdAt:{
            type:Date,default:Date.now
        }
    }
)
export const user = mongoose.model("user", userSchema);

const productSchema = new mongoose.Schema({
    productImage:String,
    productName: {
        type: String,
        required: [true, "item name has to be"],
        trim: true,
    },
    price: {
        type: Number,
    },
    quntity: {
        type: Number,
        required: true,
        
    },
});
export const product =mongoose.model("product",productSchema)


const cartSchema = new mongoose.Schema({
    productId:{type:String,required:true},
    productName: {
        type: String,
        required: [true, "item name has to be"],
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quntity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
    }
});

export const cart = mongoose.model("cart", cartSchema);