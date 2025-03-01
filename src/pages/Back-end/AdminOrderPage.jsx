// 外部資源
import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../ components /Pagination';
import ReactHelmetAsync from '../../plugins/ReactHelmetAsync';


// 環境變數
const { VITE_BASE_URL: baseUrl, VITE_API_PATH: apiPath } = import.meta.env;

export default function AdminOrderPage() {

  // const[tempProduct,setTempProduct] = React.useState({})
  const [ordersList, setOrdersList] = useState([]); //先給 productList 一個狀態：後續會從API撈回資料塞回productList 中 

  //獲取產品列表的 API 
 //在登入成功時，呼叫：管理控制台- 產品（Products）> Get API
 const getOrders = async () => {
   try {
     const res = await axios.get(
       `${baseUrl}/v2/api/${apiPath}/admin/orders`
     );
     setsetOrdersList(res.data.orders);
   } catch (error) {
     alert("取得訂單列表失敗，功能尚在研究中....請耐心等候");
   }
 };
 

  {/* 串接新增(修改）商品 API */}
  const createOrders = async () => {
   try {
     await axios.put(`${baseUrl}/v2/api/${apiPath}/admin/order/${data.id}`,{
       data:{
         ...tempOrder,
         origin_price:Number(tempProduct.origin_price),
         id:Number(tempOrder.products.id),
         qty:Number(qty),
         is_paid:tempOrder.is_paid ? 1 : 0,
       }
     }) ;
     getOrders(); // 新增後重新載入商品列表
   } catch (error) {
     alert('訂單頁面施工中，請耐心等候');
   }
 }

 useEffect(() => {
   getOrders();  // 正確的：載入時獲取商品列表
 }, [])

 // 控制分頁元件：新增一個「頁面資訊 pageInfo」的狀態 → 用來儲存頁面資訊
 const [ pageInfo , setPageInfo ] = useState({});

 //讀取當前頁面的「頁碼」 資料的判斷式條件＆動作：
 const handlePageChenge = (page) => {
   getProducts(page);
 }


  return (
      <>
        <ReactHelmetAsync title="後台系統｜訂單管理頁面" />
        <div className="container">
          <div className="row ">
            <div className="col mt-5 ">
              <div className=" d-flex justify-content-between">
                <h1 className=''>訂單管理</h1>
                <button type="button" className="btn btn-primary me-10">刪除全部訂單</button>
              </div>
              
              <div>
                <div className= "mt-5 border rounded">
                  <table className="table"> 
                    <thead>
                            <tr className='rounded-3 '>
                            <th scope="col">訂單編號</th>
                            <th scope="col">付款狀態</th>
                            <th scope="col">訂購人姓名</th>
                            <th scope="col">聯絡電話</th>
                            <th scope="col">聯絡信箱</th>
                            <th scope="col">收件地址</th>
                            <th scope="col">訂單成立時間</th>
                            <th className="text-center" scope="col" >編輯資料</th>
                            </tr>
                    </thead>
                    <tbody>
                          {ordersList.map((orders)=>(
                          <tr key={orders.id}>
                              <td>{orders.id}</td>
                              <th scope="row">{orders.is_paid?(
                                <span className="text-success">已付款</span>
                                  ) : (
                                  <>
                                      <span className="text-danger">未付款</span>
                                  </>
                                  )}
                              </th>
                              <td>{orders.user.name}</td>
                              <td>{orders.user.tel}</td>
                              <td>{orders.user.email}</td>
                              <td>{orders.user.address}</td>
                              <td>{orders.create_at}</td>
                    
                              {/* 編輯資料按鈕欄位 */}
                              <td className="text-center">
                                <div className="btn-group">
                                  <button type="button" className="btn btn-outline-primary btn-sm">編輯</button>
                                  <button type="button" className="btn btn-outline-danger btn-sm">刪除</button>
                                  </div>
                              </td>
                          </tr>
                          ))}
                    </tbody>
                  </table>

                    {/* 分頁元件 */}
                    <Pagination pageInfo={pageInfo} handlePageChenge={handlePageChenge}/>

                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    )
}