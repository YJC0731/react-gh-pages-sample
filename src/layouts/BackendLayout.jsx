import { Outlet, NavLink } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import MarqueeText from './MarqueeText';
import { useNavigate } from 'react-router-dom';
import AutoScrollToTop from '../plugins/AutoScrollToTop';


export default function BackendLayout(){

// 控制修正 header 使用 fix top 的高度使用
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 控制登入狀態
  const navigate = useNavigate();
  
  
  // 計算 navbar 高度，確保下方區塊有足夠的間距
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

    // 處理登入與登出
    const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/admin/products'); // 登入後跳轉
  };
    
  // 登出時重設狀態並回到首頁  
  const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/admin/login'); // 登出後回首頁
    };

    // 定義未登入與登入的選單（路由）
    const guestRoutes = [{ path: '/', name: '網站前台' }];
    const loggedInRoutes = [
    { path: '/admin/order', name: '訂單管理' },
    { path: '/admin/products', name: '商品管理' },
    { path: '/admin/coupon', name: '優惠券管理' },
    ];

    // 根據 `isLoggedIn` 動態切換選單
    const menuItems = isLoggedIn ? [...guestRoutes, ...loggedInRoutes] : guestRoutes;


    return (
      <>
      <AutoScrollToTop />
      {/* 登入狀態 navbar */}
      <div className="fixed-top ">
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container">
                <ul className="navbar-nav flex-row gap-5 fs-5">
                    
                    {/* 使用 .map() 渲染導覽列按鈕 */}
                    {menuItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            
                            {/* NavLink負責頁面切換： */}
                            <NavLink to={item.path} className="nav-link"  aria-current="page"  >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                 </ul>

                {/* 登入 / 登出按鈕 */}
                {isLoggedIn ? (
                    <NavLink 
                        to='/admin/login' 
                        className="btn btn-outline-light ms-3" 
                        onClick={handleLogout}
                    >
                        登出
                    </NavLink >
                    ) : (
                    <NavLink 
                        to="/admin/products" 
                        onClick={handleLogin}
                        className="btn btn-outline-light ms-3" >
                        登入
                    </NavLink>
                    )}
            </div>
        </nav>
                

        <MarqueeText
            headerRef={headerRef}
            headerHeight={headerHeight}
        />
        </div>

        {/* 下方區塊用於補足 navbar 設定 fixed top 的空間 */}
        <div style={{ marginTop: `${headerHeight}px` }}></div>

       {/* 這裡改用 Outlet（顯示動態內容），而不是直接渲染 AdminLoginPage */}
      <Outlet />
    </>
       )
}