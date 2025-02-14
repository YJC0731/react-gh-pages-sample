import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';

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
    const productModalRef = useRef(null);
    const delProductModalRef = useRef(null); //// 透過 useRef 取得刪除確認 Modal 的 DOM

     {/* 新增一個狀態來判斷:判斷當前動作是新增產品還是編輯產品 */}
    const[modalMode, setModalMode]= useState(null);

    //透過 useEffect ​的 hook，在頁面渲染後取得 productModalRef的 DOM元素
    useEffect(()=>{
      new Modal(productModalRef.current, {
        backdrop:false // 點擊Modal灰色區塊不進行關閉
      });

      //// 透過 useEffect 的 hook，在頁面渲染後初始化 Modal
      new Modal(delProductModalRef.current, {
        backdrop:false // 點擊Modal灰色區塊不進行關閉
      });

      Modal.getInstance(productModalRef.current);//取得Modal實例:Modal.getInstance(ref)
      
    },[])


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

      const modalInstance = Modal.getInstance(productModalRef.current);
      //拿到Modal實例後，即可透過modalInstance.show(); 開啟Modal
      modalInstance.show();
    }

    {/* 點擊Ｍodal的取消＆Ｘ按鈕會進行關閉 */}
    //宣告handleCloseProductModal(變數)：進行開關產品的Modal：
    const handleCloseProductModal =() =>{
      const modalInstance = Modal.getInstance(productModalRef.current);
      //拿到Modal實例後，即可透過modalInstance.hide(); 關閉Modal
      modalInstance.hide();
    }
    
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
    
    const handleModalInputChange =(e)=>{
      const { value , name , checked , type } = e.target;

      setTempProduct({
        //展開TempProduct
        ...tempProduct,
        //當值(type)為 checkbox 時，就會傳入`checked`值 ; 若type不為 checkbox 時，就會將`value`傳入`name`的屬性裡
        [name]: type=== 'checkbox' ? checked : value, 
      });
    };

  const handleImageChange = ( e , index ) =>{
    const { value } = e.target;

    const newImages = [ ...tempProduct.imagesUrl ];

    newImages[index]=value;

    setTempProduct({
      ...tempProduct, //展開TempProduct
      imagesUrl: newImages, 
    });
  };

  
  {/* 新增按鈕顯示條件：點擊時對陣列「新增」一個空字串 */}
  const handleAddImage = () => {
    const newImages = [ ...tempProduct.imagesUrl, " " ]; //複製imagesUrl到newImages的新陣列裡
    
    setTempProduct({
      ...tempProduct,
      imagesUrl:newImages, 
    });
  };

   {/* 刪除按鈕顯示條件：點擊時預設「移除」陣列中最後一個欄位 */}
  const handleRemoveImage = () => {
    const newImages = [ ...tempProduct.imagesUrl]; //複製imagesUrl到newImages的新陣列裡
    
    newImages.pop();
    
    setTempProduct({
      ...tempProduct,
      imagesUrl:newImages, 
    });
  };

  {/* 串接新增商品 API */}
  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`,{
        data:{
          ...tempProduct,
          origin_price:Number(tempProduct.origin_price),
          price:Number(tempProduct.price),
          is_enabled:tempProduct.is_enabled ? 1 : 0
        },
      });
    } catch (error) {
      alert('新增產品失敗');
    }
  };

    {/* 串接編輯商品 API */}
    const updateProduct = async () => {
      try {
        await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`,{
          data:{
            ...tempProduct,
            origin_price:Number(tempProduct.origin_price),
            price:Number(tempProduct.price),
            is_enabled:tempProduct.is_enabled ? 1 : 0
          },
        }) ;
      } catch (error) {
        alert('編輯產品失敗');
      }
    };

    {/* 串接刪除商品 API */}
    const deleteProduct = async () => {
      try {
        await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`) ;
      } catch (error) {
        alert('刪除產品失敗');
      }
    };


  {/* 點擊Modal 的「確認」按鈕條件：會呼叫 「新增產品」的API指令 */}
  const handlUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    try{
      await apiCall();

      getProducts();

      handleCloseProductModal(); //新增完產品，點擊 [ 確認 ] 按鈕後，要關閉Modal 視窗
    } catch (error){
      alert('更新產品失敗'); // API 失敗時僅顯示錯誤訊息，不關閉 Modal
    }
  };

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


  // 撰寫主圖的圖片上傳功能：handleFileChange 監聽事件的函式
  const handleFileChange = async (e) => {
    console.log(e.target); //檢查是哪個input觸發事件

    //獲取使用者選擇的第一個檔案
    const file = e.target.files[0];
    
    //使用FormData格式上傳
    const formData = new FormData();
    //加入file-to-upload的欄位，並存入使用者選擇的檔案（file)
    formData.append('file-to-upload',file)

    //console.log(formData);// 印出 FormData 物件，確認內容

    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`,formData);

      const uploadedImagerl = res.data.imageUrl;

      //如果 uploadedImagerl 上傳成功，將它 set 到 tempProduct 裡的 imageUrl
      setTempProduct({
        ...tempProduct, //複製一個tempProduct
        imageUrl:uploadedImagerl, //欄位代上imageUrl：值代入上傳的圖片uploadedImagerl
      });

    } catch (error) {
      alert('上傳圖片失敗，請確認圖片格式及大小的相關限制');
    }
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

          {/* 第四週主線任務：分頁元件模板版型放置處 */}
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination">
                
                <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                  <a onClick={()=> handlePageChenge(pageInfo.current_page - 1)}  className="page-link" href="#">
                    上一頁
                  </a>
                </li>

                {/* 頁碼生成：透過 Array.from ＋map渲染的方式：將對應的長度的陣列(頁碼)印出 */}
                { Array.from({length:pageInfo.total_pages}) .map((_,index)=>(
                    <li className={`page-item ${pageInfo.current_page === index + 1  && 'active'}`}>
                    {/* 取得前頁面資料的判斷式條件 */}
                    <a onClick={()=> handlePageChenge(index + 1)} className="page-link" href="#">
                      {/* 在頁碼處帶上:因為index 是從0開始，所以用+1方式，讓頁碼從 1 開始做顯示 */}
                      { index + 1 }
                    </a>
                  </li>
                ))}

                <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                  <a onClick={()=> handlePageChenge(pageInfo.current_page+1) } className="page-link" href="#">
                    下一頁
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
        </div>
        ) : (
      //已完成的登入模板
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
    )}

    
    {/* Week03主線任務：加入產品 Modal */}
    <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            {/* 調整產品 Modal 的標題、傳入的值 */}
            <h5 className="modal-title fs-4">
              { modalMode ==='create'? '新增產品':'編輯產品'}
            </h5>
            <button 
              onClick={handleCloseProductModal} 
              type="button" 
              className="btn-close" 
              aria-label="Close">
            </button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
               
               {/* 主圖的圖片上傳功能 */}
               <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={tempProduct.imageUrl}
                      onChange={handleModalInputChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {tempProduct.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={ (e) => handleImageChange( e , index ) }
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}

                    {/* 撰寫產品 Modal 多圖按鈕顯示邏輯 */}
                    <div className="btn-group w-100">
                        {tempProduct.imagesUrl.length < 5 &&
                         (tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' ) && (
                          <button 
                            onClick={handleAddImage} 
                            className="btn btn-outline-primary btn-sm w-100"
                            >
                              新增圖片
                          </button>
                        )}

                         {tempProduct.imagesUrl.length >= 1 && (
                          <button onClick={handleRemoveImage} 
                            className="btn btn-outline-danger btn-sm w-100"
                            >
                              取消圖片
                          </button>
                        )}
                    </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={tempProduct.title}
                    onChange={handleModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={tempProduct.category}
                    onChange={handleModalInputChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={tempProduct.unit}
                    onChange={handleModalInputChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={tempProduct.origin_price}
                      onChange={handleModalInputChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                      min="0"  // 限制最小值為 0，0211致凱助教建議：原價、售價 input 記得加上 min=0，否則會可以選擇負的數值
                    />
                  </div>

                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={tempProduct.price}
                      onChange={handleModalInputChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                      min="0"  // 限制最小值為 0，0211致凱助教建議：原價、售價 input 記得加上 min=0，否則會可以選擇負的數值
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={tempProduct.description}
                    onChange={handleModalInputChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={tempProduct.content}
                    onChange={handleModalInputChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    checked={tempProduct.is_enabled}
                    onChange={handleModalInputChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button 
              onClick={handleCloseProductModal} 
              type="button" 
              className="btn btn-secondary"
              >
              取消
            </button>
            <button 
              onClick={handlUpdateProduct} 
              type="button" 
              className="btn btn-primary"
              >
                確認
            </button>
          </div>
        </div>
      </div>
    </div>

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