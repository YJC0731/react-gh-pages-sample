import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ProductModal from '../../components/ProductModal';
import DelProductModal from '../../components/DelProductModal';
import ReactHelmetAsync from '../../plugins/ReactHelmetAsync';
import Toast from '../../components/Toast';

const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;



// 產品資料初始狀態
const defaultModalState = {
    imageUrl: '',
    title: '',
    category: '',
    unit: '',
    origin_price: '',
    price: '',
    description: '',
    content:  '',
    is_enabled: 0,
    is_hot: 0, 
    imagesUrl: [''],
  };
  


export default function AdminProductsPage(){

//   const [isAuth, setIsAuth ] = useState(false); //在還沒登入前用false（預設）狀態
  const navigate = useNavigate();
  // 串接 API - 驗證登入:可以透過點擊按鈕的方式戳 API 來驗證使用者是否登入過
  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
    //   getProducts();//取得產品資料
    //   setIsAuth(true); //當使用者登入後就會跳轉到產品頁面 
    } catch (error) {
      alert('請先登入');
      navigate('/admin/login');
      console.error(error);
    }
  };

  // 判斷目前是否已是登入狀態，取出在 cookie 中的 token
  // 若想在登入頁面渲染時呼叫checkUserLogin裡的API>需要透過React hook：useEffect 戳一次API
  useEffect(() => {
    //戳API時，能從 cookie 取得token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)yjToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token; //將 token 帶到 axios 上：後續的axios就會帶上這行token
    checkUserLogin(); //戳checkUserLogin API :
  }, []);

  const [productList, setProductList] = useState([]); //先給 productList 一個狀態：後續會從API撈回資料塞回productList 中 

  //在登入成功時，呼叫：管理控制台- 產品（Products）> Get API
  //加入讀取Page資料變數動作
  const getProducts = async ( page = 1 ) => {
    try {
      const res = await axios.get(
        `${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`
      );
      setProductList(res.data.products);
      //從 產品 API 取得頁面資訊getProduct，並存進狀態中（把res.data.Pagination 塞進去 setPageInfo 裡面）
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
    }
  };

    useEffect(() => {
        getProducts();
    }, []);

    {/* 綁定產品 Modal 狀態:value={tempProduct.對應的變數} + onChange={handleModalInputChange}事件 */}
    const[tempProduct,setTempProduct] = useState(defaultModalState);  

    //新增狀態做「編輯、新增Modal」開關功能控制，預設狀態：關閉（ 帶入false值 ）
    const [isProductModalOpen , setIsProductModalOpen ] = useState(false);

    //新增狀態做「刪除Modal」開關功能控制，預設狀態：關閉（ 帶入false值 ）
    const [isDelProductModalOpen , setIsDelProductModalOpen ] = useState(false);


     {/* 開啟 modal 方法 | 新增一個狀態來判斷:判斷當前動作是新增產品還是編輯產品 */}
    const[modalMode, setModalMode]= useState(null);

    {/* 點擊[刪除]按鈕時，開啟刪除確認 Modal：delProductModalRef的開啟 */}
    const handleOpenDelProductModal =(product) =>{
      setTempProduct(product);
      
      //改成用 isOpen 做開關判斷:不直接取得getInstance邏輯改成setIsDelProductModalOpen(true)：告訴Modal現在要開
      setIsDelProductModalOpen(true);
    }

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
    }

   
  // 控制分頁元件：新增一個「頁面資訊 pageInfo」的狀態 → 用來儲存頁面資訊
  const [ pageInfo , setPageInfo ] = useState({});

  //讀取當前頁面的「頁碼」 資料的判斷式條件＆動作：
  const handlePageChenge = (page) => {
    getProducts(page);
  }


  return (
    <>
      <ReactHelmetAsync title="後台系統｜產品管理頁面" />
      <div className="container py-5">
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
                    建立新的產品
              </button>
            </div>

            <table className="table mt-5">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  {/* Week04_lv3任務:新增自訂欄位：是否為熱銷產品 is_hot */}
                 <th  scope="col">熱銷狀態</th> 
                  <th className="text-center" scope="col">編輯資料</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product)=>(
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled? (
                        <span className="text-success">啟用中</span>
                       ) : (
                        <span className="text-danger">未啟用</span>
                       )}
                    </td>
                    
                    {/* 新增自訂欄位：是否為熱銷產品 is_hot */}
                    <td>
                      {product.is_hot? (
                        <span className="text-danger">熱銷商品</span>
                      ) : (
                        <span className="text-secondary">一般商品</span>
                      )}
                    </td>
                    <td className="text-center">
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
        </div>
        <Pagination pageInfo={pageInfo} handlePageChenge={handlePageChenge}/>

        {/* 新增與編輯 modal */}
        <ProductModal
            modalMode={modalMode}
            getProducts={getProducts}
            tempProduct={tempProduct}
            isOpen={isProductModalOpen}
            setIsOpen={setIsProductModalOpen} 
        />

        {/* Week03主線任務：加入刪除產品 Modal */}
        <DelProductModal
            tempProduct={tempProduct}
            isOpen={isDelProductModalOpen}
            setIsOpen={setIsDelProductModalOpen}
            getProducts={getProducts}
        />

        <Toast />

   </>
  );
}