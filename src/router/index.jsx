import { createHashRouter } from "react-router-dom";
//前台頁面
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/Front-end/HomePages";
import ProductsListPage from "../pages/Front-end/ProductsListPage";
import ProductDetailPage from "../pages/Front-end/ProductDetailPage";
import CartPage from "../pages/Front-end/CartPage";
import NotFoundPage from "../pages/Front-end/NotFoundPage";

//後台頁面
import BackendLayout from "../layouts/BackendLayout";
import AdminLoginPage from "../pages/Back-end/AdminLoginPage";
import AdminOrderPage from "../pages/Back-end/AdminOrderPage";
import AdminProductsPage from "../pages/Back-end/AdminProductsPage";
import AdminCouponPage from "../pages/Back-end/AdminCouponPage";

const router = createHashRouter([
    
    //前台頁面
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
    },
    {
       path:'*',
       element: <NotFoundPage />,
    },

    //後台管理系統頁面
    {
        path:'/admin',
        element: < BackendLayout />, //這裡是後台框架
        children: [
            {
                path:'login', //改成相對路徑，讓它變成 `/admin/login`，同時確保是 'login'，而不是 '/login'
                element:<AdminLoginPage /> 
            },
            {
                path:'order',
                element: <AdminOrderPage />, 
            }, 
            {
                path:'products',
                element:<AdminProductsPage />, 
            },
            {
                path:'coupon',
                element:<AdminCouponPage />, 
            },
          ]
    },
    {
        path:'*',
        element: <NotFoundPage />,
    },

])

export default router;