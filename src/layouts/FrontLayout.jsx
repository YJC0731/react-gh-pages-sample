import { NavLink, Outlet } from "react-router-dom";

const routes = [
    { path: "/", name: "首頁" },
    { path: "/products", name: "產品列表" }, // 🚨 這裡的路由應該和 index.jsx 一致
    { path: "/cart", name: "購物車" },
  ];

export default function FrontLayout(){
    return(
     <>
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container justify-content-center">
                <ul className="navbar-nav flex-row gap-5 fs-5">
                    {routes.map((routes) => (
                        <li 
                            key={routes.path} 
                            className="nav-item">

                        <NavLink 
                            className="nav-link" 
                            aria-current="page" 
                            to={routes.path}
                            >
                            {routes.name}
                        </NavLink>
                        </li>
                        )
                    )}
                </ul>
            </div>
        </nav>
        <Outlet/>
     </>
    )
}