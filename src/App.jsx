import axios from 'axios';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL ;
const API_PATH = import.meta.env.VITE_API_PATH ;

function App() {
  const [isAuth, setIsAuth ] = useState(false); //在還沒登入前用false（預設）狀態

  const[tempProduct,setTempProduct] = useState({});
  const [productList, setProductList] = useState([]); //先給 productList 一個狀態：後續會從API撈回資料塞回productList 中 
  
  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example",
  })

  const handleInputChange = (e) => {
    const { value , name } = e.target;
  
    setAccount({
      ...account,
      [name]:value,
    })
  }

  const handleLogin = (e)=>{
    e.preventDefault();
    
      axios.post(`${BASE_URL}/v2/admin/signin`,account)
      // 將 setIsAuth 改成 true > .then((res)=> console.log(res)
      .then((res)=> {
        //透過解構方式，取得：token , expired 資料
        const { token , expired } =res.data;
        
        //將 token 存進 cookie
        document.cookie = `yjToken = ${token}; expires=${new Date(expired)}`; 
        
        //發送請求前，需要在headers 裡帶入 token 資料，後續動作的請求都會自動帶上Token資料
        axios.defaults.headers.common['Authorization'] = token;

        //在登入成功時，呼叫：管理控制台- 產品（Products）> Get API
        axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
          .then((res)=>  setProductList(res.data.products))
          .catch((error) => console.dir(error));
        
        setIsAuth(true);
      }).catch((error)=> alert("登入失敗"))
    }

    // 串接 API - 驗證登入:可以透過點擊按鈕的方式戳 API 來驗證使用者是否登入過
      const checkUserLogin =() =>{
        axios.post(`${BASE_URL}/v2/api/user/check`)
        .then((res)=> alert("使用者登入中"))
        .catch((error)=> console.dir(error))
      }

  return (
    <>
    { isAuth ? ( <div className="container mt-5">
                    <div className="row">
                        {/* 左邊產品列表 */}
                        <div className="col-6">
                            <button onClick={checkUserLogin} className='btn btn-success mb-5' type='button'>檢查使用者是否登入</button>
                            <h2>產品列表</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col">產品名稱</th>
                                    <th scope="col">原價</th>
                                    <th scope="col">售價</th>
                                    <th scope="col">是否啟用</th>
                                    <th scope="col">查看細節</th>
                                    </tr>
                                </thead>
                                <tbody>
                                   {productList.map((product)=>(
                                        <tr key={product.id}>
                                            <th scope="row">{product.title}</th>
                                            <td>{product.origin_price}</td>
                                            <td>{product.price}</td>
                                            <td>{product.is_enabled? (
                                                  <span className="text-success">啟用中</span>
                                                ) : (
                                                <>
                                                  <span className="text-danger">未啟用</span>
                                                </>
                                                 )
                                                }
                                            </td>
                                            <td><button onClick={()=>{setTempProduct(product)}} type='button' className="btn btn-primary">查看細節</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* 右邊產品列表 */}
                        <div className="col-6">
                            <h2>單一產品細節</h2>

                            {/* 資料點擊呈現判斷式 */}
                            {tempProduct.title?(
                                <div className="card">
                                    <img src={tempProduct.imageUrl} className="card-img-top" alt={tempProduct.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{tempProduct.title} <span className="badge text-bg-primary">{tempProduct.category}</span></h5>
                                        <p className="card-text">商品描述：{tempProduct.description}</p>
                                        <p className="card-text">商品內容：{tempProduct.content}</p>
                                        <p className="card-text"><del>{tempProduct.origin_price}元</del> / {tempProduct.price}元</p>
                                        <h5 className="card-title">更多圖片：</h5>
                                        {tempProduct.imagesUrl?.map((image,index)=>{
                                            return <img className="img-fluid" src={image} key={index}/>
                                        })
                                        }
                                    </div>
                                </div>
                            ) : <p className="text-secondary">請選擇一個商品查看</p>
                            }
                        </div>
                    </div>
                </div>
                ) :
      //已完成的登入模板
          <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input name="password" value={account.password} onChange={handleInputChange}  type="password" className="form-control" id="password" placeholder="Password" />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    }
    </>  
    
  )
}

export default App