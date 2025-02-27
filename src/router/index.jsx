import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/Front-end/HomePages";
import ProductsListPage from "../pages/Front-end/ProductsListPage";

const router = createHashRouter([
    {
       path:'/',
       element: <FrontLayout />,
       children: [
        {
            path:'',
            element:<HomePage />, 
        }, 
        {
            path:'/products',
            element:<ProductsListPage />, 
        }
      ]
    }
])

export default router;