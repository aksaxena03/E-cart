import axios from "axios"
const backend = import.meta.env.VITE_BACKEND_URL
export default function Mock(){
    const handleOnchange=async()=>{
        const response=await axios.post(`${backend}/api/products`)
        console.log(response)
    }

    return(
        <div className="">
            <button type="button" onClick={handleOnchange}> add products</button>
        </div>
    )
}