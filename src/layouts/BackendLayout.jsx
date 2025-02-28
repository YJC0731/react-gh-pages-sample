import { Outlet, NavLink } from 'react-router-dom';

const routes = [
    { 
        path: '/', 
        name: '回到首頁' 
    }];


export default function BackendLayout(){


    return (
      <>
        {/* 導覽列 */}
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container">
                <ul className="navbar-nav flex-row gap-5 fs-5">
                    
                    {/* 使用 .map() 渲染導覽列按鈕 */}
                    {routes.map((routes) => (
                        <li 
                            key={routes.path} 
                            className="nav-item">
                        
                        {/* NavLink負責頁面切換： */}
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

        {/* 顯示動態內容 */}
        <Outlet/>
      </>
       )
}