import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.css'; // 引入 CSS
import { RouterProvider } from 'react-router-dom'; //自動引入
import router from './router'; //自動引入
import { store } from './redux/store';


// import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)