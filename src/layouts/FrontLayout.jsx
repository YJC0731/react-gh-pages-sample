import { Outlet } from "react-router-dom";

export default function FrontLayout(){
    return(
     <>
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container">
                <ul className="navbar-nav flex-row gap-5 fs-5">
                <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="#">首頁</a>
                </li>
                <li className="nav-item"><a className="nav-link" href="#">產品頁</a></li>
                <li className="nav-item"><a className="nav-link" href="#">購物車</a></li>
                </ul>
            </div>
        </nav>
        <Outlet/>
     </>
    )

}