import { createHashRouter } from "react-router-dom";

const router = createHashRouter([
    {
       path:'/',
       element: <h1 className="mt-5 text-center"> Week06店鋪 | 歡迎你 ( index ) </h1> 
    }
])

export default router;