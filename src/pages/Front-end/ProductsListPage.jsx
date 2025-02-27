import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";

import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsListPage () {

    const [ products, setProducts ] = useState([]);
    const [ isLoading , setIsLoading ] = useState(false);
    const [ isScreenLoading , setIsScreenLoading ] = useState(false);

    // Week06_取得產品列表
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
        //getCart();
      }, []);
    
    
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

        //getCart();
        } catch (error) {
        alert ('加入購物車失敗');
        } finally {
        setIsLoading(false)
        }
    }


    return(
      <>
        <div className="container">
            <h2 className="mt-5 mb-5">React本鋪｜商品總覽</h2>
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
                                //onClick={() => handleSeeMore(product)}//後續會改成:Link 點擊後跳轉到產品詳細頁面->因此此處可以先做刪除
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
      </>  
    )
}