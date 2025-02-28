import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/Front-end/HomePages";
import ProductsListPage from "../pages/Front-end/ProductsListPage";
import ProductDetailPage from "../pages/Front-end/ProductDetailPage";
import CartPage from "../pages/Front-end/CartPage";

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
            path:'products',
            element:<ProductsListPage />, 
        },
        {
            path:'products/:id',
            element:<ProductDetailPage />, 
        },
        {
            path:'cart',
            element:<CartPage />, 
        }
      ]
    }
])

export default router;