import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import LoginPage from './pages/LoginPage';
import Pagination from './ components /Pagination';
import ProductModal from './ components /ProductModal';

const BASE_URL = import.meta.env.VITE_BASE_URL ;
const API_PATH = import.meta.env.VITE_API_PATH ;

//綁定產品 Modal 狀態的預設值 模板語法
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};


function App() {
  const [isAuth, setIsAuth ] = useState(false); //在還沒登入前用false（預設）狀態
  const [productList, setProductList] = useState([]); //先給 productList 一個狀態：後續會從API撈回資料塞回productList 中 

  //新增狀態做Modal開關功能控制，預設狀態：關閉（ 帶入false值 ）
  const [isProductModalOpen , setIsProductModalOpen ] = useState(false);


  //獲取產品列表的 API 請求:YJ第二週主線任務-> Jay教練提供的模板
  //在登入成功時，呼叫：管理控制台- 產品（Products）> Get API
  //加入讀取Page資料變數動作
  const getProducts = async ( page = 1 ) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProductList(res.data.products);
      //從 產品 API 取得頁面資訊getProduct，並存進狀態中（把res.data.Pagination 塞進去 setPageInfo 裡面）
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
    }
  };


    // 串接 API - 驗證登入:可以透過點擊按鈕的方式戳 API 來驗證使用者是否登入過
      const checkUserLogin = async() =>{
        try{
          await axios.post(`${BASE_URL}/v2/api/user/check`);
          getProducts();//取得產品資料
          setIsAuth(true); //當使用者登入後就會跳轉到產品頁面 
        } catch(error){
          console.dir(error);
      }
    };
  
    //若想在登入頁面渲染時呼叫checkUserLogin裡的API>需要透過React hook：useEffect 戳一次API
    useEffect(()=>{
      //戳API時，能從 cookie 取得token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)yjToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      // console.log("讀取到的 token:", token); // Debugging
      //將 token 帶到 axios 上：後續的axios就會帶上這行token
      axios.defaults.headers.common['Authorization'] = token;

      checkUserLogin(); //戳checkUserLogin API :
    },[])

    //透過 useRef 取得 DOM
    const delProductModalRef = useRef(null); //// 透過 useRef 取得刪除確認 Modal 的 DOM

     {/* 新增一個狀態來判斷:判斷當前動作是新增產品還是編輯產品 */}
    const[modalMode, setModalMode]= useState(null);

    //透過 useEffect ​的 hook，在頁面渲染後取得 productModalRef的 DOM元素
    useEffect(()=>{
      //// 透過 useEffect 的 hook，在頁面渲染後初始化 Modal
      new Modal(delProductModalRef.current, {
        backdrop:false // 點擊Modal灰色區塊不進行關閉
      });
      
    },[])

    
    {/* 點擊[刪除]按鈕時，開啟刪除確認 Modal：delProductModalRef的開啟 */}
    const handleOpenDelProductModal =(product) =>{
      setTempProduct(product);
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }

    {/* 點擊刪除產品的Ｍodal：delProductModalRef的關閉 */}
    const handleCloseDelProductModal =() =>{
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.hide();
    }


    {/* 綁定產品 Modal 狀態:value={tempProduct.對應的變數} + onChange={handleModalInputChange}事件 */}
    const[tempProduct,setTempProduct] = useState(defaultModalState); 
    

    {/* 串接刪除商品 API */}
    const deleteProduct = async () => {
      try {
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`) ;
      } catch (error) {
        alert('刪除產品失敗');
      }
    };

    {/* 點擊「建立新的產品」＋「編輯」按鈕，會打開Ｍodal */}
    //宣告handleOpenProductModal(變數)：進行開關產品的Modal：
    const handleOpenProductModal =(mode , product) =>{
      setModalMode(mode);

      switch(mode){
        case 'create':
          setTempProduct(defaultModalState);
          break;

          case 'edit':
            setTempProduct(product);
            break;
          
          default:
            break;
      }

      setIsProductModalOpen(true);// 改成用 isOpen 做開關判斷 :不能直接取得getInstance邏輯 → 要改成：setIsProductModalOpen(true);：告訴Modal現在要開

      // const modalInstance = Modal.getInstance(productModalRef.current);
      // //拿到Modal實例後，即可透過modalInstance.show(); 開啟Modal
      // modalInstance.show();
    }

    {/* 點擊刪除產品Modal的「刪除」鈕時，會觸發刪除API的函式 */}
    const handleDeleteProduct = async () => {
      try {
        await deleteProduct();

        getProducts(); //成功刪除產品deleteProduct()，需要呼叫getProducts();更新產品列表

        handleCloseDelProductModal(); //getProducts();更新成功後 > 把刪除的Ｍodal 關閉

      } catch (error) {
        alert('刪除產品失敗'); //如果刪除失敗：顯示「刪除產品失敗」的告警訊息
      }
    };

  // 第四週主線任務＿分頁元件
  // 1.新增一個「頁面資訊 pageInfo」的狀態 → 用來儲存頁面資訊
  const [ pageInfo , setPageInfo ] = useState({});

  //讀取當前頁面的「頁碼」 資料的判斷式條件＆動作：
  const handlePageChenge = (page) => {
    getProducts(page);
  }


  return (
    <>
    { isAuth ? ( 
      <div className="container mt-5">
        <div className="row">
          {/* 左邊產品列表 */}
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button 
              onClick={()=>handleOpenProductModal('create')} 
              type="button" 
              className="btn btn-primary"
              >
                建立新的產品</button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
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
                            <span className="text-danger">未啟用</span>
                        )}
                    </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            onClick={() => handleOpenProductModal('edit', product)} 
                            type="button" 
                            className="btn btn-outline-primary btn-sm"
                            >
                              編輯
                          </button>
                          
                          <button 
                            onClick={()=>handleOpenDelProductModal(product)} 
                            type="button" 
                            className="btn btn-outline-danger btn-sm"
                            >
                              刪除
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
          </div>

          <Pagination pageInfo={pageInfo} handlePageChenge={handlePageChenge}/>
        </div>
        ) : <LoginPage getProducts={getProducts} /> } 

    <ProductModal 
      modalMode={modalMode}
      getProducts={getProducts}
      tempProduct={tempProduct}
      isOpen={isProductModalOpen}
      setIsOpen={setIsProductModalOpen} 
      
      />

   {/* Week03主線任務：加入刪除產品 Modal */}
      <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>


    </>  
  );
}

export default App