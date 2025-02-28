import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { VITE_BASE_URL: baseUrl } = import.meta.env;


export default function AdminLoginPage(){
   //登入資訊
    const [account, setAccount] = useState({
        username: '',
        password: '',
    });

  // 檢查登入狀態
  const handleInputChange = (event) => {
    const { value, name } = event.target; // 將點擊後觸發的 event 事件的 value 和 name 解構出來

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault(); //移除預設觸發行為：防止表單預設提交

    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);

      const { token, expired } = res.data; //透過解構方式，取得：token , expired 資料
      
      // 將 token 存進 cookie，確保不同頁面可存取（登入成功後將 token 於儲存 cookie）
      document.cookie = `yjToken=${token}; expires=${new Date(expired)}`; 
      
      //發送請求前，需要在headers 裡帶入 token 資料，後續動作的請求都會自動帶上Token資料
      axios.defaults.headers.common['Authorization'] = token; 

      alert('登入成功');
      navigate('/admin/admin-products'); //確保路徑正確
    } catch (error) {
      alert('登入失敗');
    }
  };

  return(
    //已完成的登入模板
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form 
            onSubmit={handleLogin} 
            className="d-flex flex-column gap-3"
        >
        <div className="form-floating mb-3">
            <input 
                type="email" 
                className="form-control" 
                id="emailInput" 
                name="username" //確保這與 useState 的 key 一致
                placeholder="name@example.com" 
                value={account.username} 
                onChange={handleInputChange} 
            />
            <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
            <input 
                type="password" 
                className="form-control" 
                id="passwordInput" 
                name="password" //確保這與 useState 的 key 一致
                placeholder="Password" 
                value={account.password} 
                onChange={handleInputChange}  
            />
            <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
};