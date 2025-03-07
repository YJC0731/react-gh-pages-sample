import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 環境變數
const { VITE_BASE_URL: baseUrl} = import.meta.env;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  // 驗證登入狀態
  const checkUserLogin = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)yjToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      axios.defaults.headers.common['Authorization'] = token;

      await axios.post(`${baseUrl}/v2/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.error('驗證失敗:', error);
    }
  };

  // 頁面刷新也會檢查登入狀態
  useEffect(() => {
    checkUserLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, checkUserLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
