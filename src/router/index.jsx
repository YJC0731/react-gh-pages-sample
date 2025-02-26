import { createHashRouter } from "react-router-dom";
import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/HomePages";

const router = createHashRouter([
    {
       path:'/',
       element: <FrontLayout />,
       children: [
        {
            path:'',
            element:<HomePage />, 
        }
      ]
    }
])

export default router;