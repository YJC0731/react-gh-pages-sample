import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";

import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Week05CartsPage() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);

  // Week05_cart狀態設定|
  const [ cart , setCart ]=useState({});

  //
  const [ isScreenLoading , setIsScreenLoading ] = useState(false);
  const [ isLoading , setIsLoading ] = useState(false);

   // Week05_取得購物車列表資料|
  const getCart = async () => { 
    try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
        setCart(res.data.data); //確保 cart 是整個物件
    } catch (error) {
        alert('取得購物車列表失敗，請再次嘗試')
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
      } finally {
        setIsScreenLoading(false)
      }
    };
    getProducts();
    getCart();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();

  // 嘗試將焦點移回按鈕
  setTimeout(() => {
    document.getElementById(`seeMoreButton-${tempProduct.id}`)?.focus();
  }, 100);
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

  // Week05_購物車功能串接|1.加入購物產品函式
  const addCartItem = async( product_id , qty ) => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`,{
        data:{
          product_id,
          qty: Number(qty),
        }
      })

      getCart();
    } catch (error) {
      alert ('加入購物車失敗');
    } finally {
      setIsLoading(false)
    }
  }

    // Week05_購物車功能串接|刪除「全部」購物列表資料函式
    const removeCart = async( ) => {
      setIsScreenLoading(true)
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`)
      getCart();
    } catch (error) {
      alert ('刪除購物車失敗');
    } finally {
      setIsScreenLoading(false)
    }
    }


    // Week05_購物車功能串接|刪除「單一」購物列表資料函式
    const removeCartItem = async( cartItem_id ) => {
      setIsScreenLoading(true)
      try {
        const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`)
        getCart();
      } catch (error) {
        alert ('該項商品刪除失敗');
      }finally{
        setIsScreenLoading(false)
      }
    }

    // Week05_購物車功能串接|調整購物車產品數量
    const updateCartItem = async( cartItem_id ,product_id , qty ) => {
      setIsScreenLoading(true)
      try {
        const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`,{
          data:{
            product_id,
            qty:Number(qty)
          }
        })
        getCart();
      } catch (error) {
        alert ('更新商品數量失敗');
      } finally {
        setIsScreenLoading(false)
      }
    } 

    // Week05_用 React Hook From 做表單驗證
    const{
      register,
      handleSubmit,
      formState:{ errors },
      reset //透過 reset 清空表單
    } = useForm()

    // Week05_表單提交函式
    const onSubmit = handleSubmit((data) => {
      console.log("表單送出成功！", data) //方便開發時檢查表單內容輸出資料

      const { message , ...user } = data; //拆解物件，將message從data取出，剩下的內容存進user變數

      //Ｗeek05 | 重新整理資料格式
      //將 user 和 message 被包進 data 物件裡，再重新包裝成一個新物件 userInfo
      const userInfo = {
        data:{
          user,
          message
        }
      }
      //呼叫 checkout 這個函式，把整理好的 userInfo 傳給後端 API，進行結帳
      checkout(userInfo);
    }) 

    //Week05_購物車結帳API
    const checkout = async (data) => {
      setIsScreenLoading(true)
      try {
        const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
        reset() //透過 reset 清空表單
      } catch (error) {
        alert ('結帳失敗');
      } finally{
        setIsScreenLoading(false)
      }
      }

 
 return (
    // 產品列表
    <div className="container">
      <div className="col">
        <div className="mt-4 ">
        <h2 className="mt-5 mb-5">Week05 本鋪｜商品總覽</h2>
          <table className="table align-middle">
            <thead className="fs-5">
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ width: "200px" }}>
                    <img
                      className="img-fluid"
                      src={product.imageUrl}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6 text-black-50">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.origin_price}元</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        id={`seeMoreButton-${product.id}`} // 為每個產品的按鈕加上唯一 ID
                        onClick={() => handleSeeMore(product)}
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        查看更多
                      </button>
                      <button 
                        disabled = {isLoading}
                        onClick={()=> addCartItem(product.id , 1)}
                        type="button" 
                        className="btn btn-outline-danger d-flex align-items-center gap-2"
                      >
                        加到購物車
                        {isLoading && (
                        <ReactLoading
                          type={"spin"}
                          color={"#000"}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            ref={productModalRef}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            className="modal fade"
            id="productModal"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">
                    產品名稱：{tempProduct.title}
                  </h2>
                  <button
                    onClick={closeModal} // 讓 closeModal() 負責關閉
                    type="button"
                    className="btn-close"
                    // data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={tempProduct.imageUrl}
                    alt={tempProduct.title}
                    className="img-fluid"
                  />
                  <p className="mt-3">商品描述：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                    價錢：{tempProduct.price}{" "}
                    <del className="text-black-50">{tempProduct.origin_price}</del> 元
                  </p>
                  <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select
                      value={qtySelect}
                      onChange={(e) => setQtySelect(e.target.value)}
                      id="qtySelect"
                      className="form-select"
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    disabled={isLoading}
                    onClick={()=> addCartItem(tempProduct.id , qtySelect)}
                    type="button" 
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    加入購物車
                    {isLoading && ( <ReactLoading
                      type={"spin"}
                      color={"#000"}
                      height={"1.5rem"}
                      width={"1.5rem"}
                    /> )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 判斷購物車資料:當購物車沒有資料時，不顯示列表 */}
          {cart.carts?.length > 0 && (
            <div>
              <div className="mt-5 mb-5">
                <div className="text-end py-3 d-flex justify-content-between">
                  <h2>購物車清單</h2>
                  <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                    清空購物車
                  </button>
                </div>
              </div>

              <table className="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th style={{ width: "150px" }}>數量/單位</th>
                    <th className="text-end">單價</th>
                  </tr>
                </thead>

                <tbody>
                {cart.carts?.map((cartItem)=>(
                  <tr key={cartItem.id}>
                    <td>
                      <button onClick={()=>removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                        x
                      </button>
                    </td>
                    <td>{cartItem.product.title}</td>
                    <td style={{ width: "150px" }}>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button
                            onClick={()=> updateCartItem(cartItem.id , cartItem.product_id , cartItem.qty - 1)}
                            disabled={cartItem.qty === 1}
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            -
                          </button>
                          
                          {/* 數量欄位 */}
                          <span
                            className="btn border border-dark"
                            style={{ width: "50px", cursor: "auto" }}
                          >{cartItem.qty}</span>
                          <button
                            onClick={()=> updateCartItem(cartItem.id , cartItem.product_id , cartItem.qty + 1)}
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                          {cartItem.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">{cartItem.total}</td>
                  </tr>
                ))}
                  
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: "130px" }}>
                      {cart.total}
                      </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Week05|用ReactHook From做表單驗證 */}
        <div className="my-5 row justify-content-center">
          <form onSubmit={onSubmit} className="col-md-6">
            <div className="mb-3">
              {/* 綁定 register */}
              <h2 className="mt-5 mb-5">訂購人資訊</h2>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register('email',{
                  required:'Email欄位必填',
                  pattern:{ //驗證Email格式
                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                   message:'請檢查Email格式,輸入是否正確'
                  }
                })}
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="請輸入 Email"
              />

              {/* 當有錯誤時才顯示錯誤資訊 */}
              {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
            </div>

            {/* 訂購人資訊>姓名欄位區塊 */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                {...register('name', {
                  required:'姓名欄位必填'
                })}
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="請輸入姓名"
              />

              {/* 當有錯誤時才顯示錯誤資訊的判斷條件 */}
              {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
            </div>

            {/* 訂購人資訊>電話欄位區塊 */}
            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                {...register('tel', {
                  required: '電話欄位必填',
                  pattern: {
                    value: /^0[2-8]\d{7}|09\d{8}$/,
                    message: '請檢查電話格式，輸入是否正確'
                  }
                })}
                id="tel"
                type="text"
                className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                placeholder="請輸入電話"
              />

              {/* 當有錯誤時才顯示錯誤資訊 */}
              {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
            </div>

            
            {/* 訂購人資訊>地址欄位區塊 */}
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                {...register('address', {
                  required: '地址欄位必填'
                })}
                id="address"
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="請輸入地址"
              />

              {/* 當有錯誤時才顯示錯誤資訊 */}
              {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
            </div>


            {/* 訂購人資訊>留言欄位區塊 */}
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea
                {...register('message')}
                id="message"
                className="form-control"
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>  
    
      {/* Week05_全螢幕Loading模板資料 */}
      { isScreenLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.3)",
              zIndex: 999,}}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
      
      
    
    </div>
  );
}

export default Week05CartsPage;