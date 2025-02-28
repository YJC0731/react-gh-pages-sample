import { Outlet, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const routes = [{ path: '/', name: '回到首頁' }];

const BASE_URL = import.meta.env.VITE_BASE_URL ;


export default function BackendLayout(){

    const [account, setAccount] = useState({
        username: "example@test.com",
        password: "example",
      });

    const handleInputChange = (e) => {
    const { value , name } = e.target;
    
    setAccount({
        ...account,
        [name]:value,
    });
    };
    
    //YJ第二週主線任務資料，改為async await的寫法
    const handleLogin = async (e)=>{
    e.preventDefault(); //移除預設觸發行為：防止表單預設提交
    
    try{
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`,account);
      
      //透過解構方式，取得：token , expired 資料
      const { token, expired } = res.data;
      //將 token 存進 cookie，確保不同頁面可存取
      document.cookie = `yjToken=${token}; expires=${new Date(expired)}`; 

      // 發送請求前，需要在headers 裡帶入 token 資料，後續動作的請求都會自動帶上Token資料
      axios.defaults.headers.common['Authorization'] = token;
      
      getProducts();

      // 更新登入狀態：將 setIsAuth 改成 true
      setIsAuth(true);
    } catch(error){
      // console.error("登入失敗", error);
      alert("登入失敗");
      }
    };

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

        {/* 已完成的登入模板 */}
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
            <input 
            name="username" 
            value={account.username} 
            onChange={handleInputChange} 
            type="email" 
            className="form-control" 
            id="username" 
            placeholder="name@example.com" 
            />
            <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
            <input 
            name="password" 
            value={account.password} 
            onChange={handleInputChange}  
            type="password" 
            className="form-control" 
            id="password" 
            placeholder="Password" 
            />
            <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
        
        {/* 顯示動態內容 */}
        <Outlet/>
      </>
       )
}