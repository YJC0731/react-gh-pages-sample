import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { dispatch } from "d3";
import { removeMessage } from "../redux/toastSlice";

//讓其他人在一開始就能知道Toast 訊息setTimeout設定多少顯示的秒數
const TOAST_DURATION = 2000;


export default function Toast ( ) {

    //透過 message 渲染 Toast
    const messages = useSelector ( ( state ) => state.toast.messages);

    //新增吐司實例
    const toastRefs = useRef({});

   //
   const dispatch = useDispatch();
   
    //透過 useEffect 遍歷訊息
    useEffect(()=>{
        messages.forEach((message)=>{
            const messageElement = toastRefs.current[message.id];

            if(messageElement){
                const totastInstance = new BsToast(messageElement);
                totastInstance.show();

                setTimeout(()=>{
                    dispatch(removeMessage(message.id))
                },TOAST_DURATION);
            }
        })
    },[messages])

    //手動關閉Toast的方法
    const handleDismiss = (message_id => {
        dispatch(removeMessage(message_id))
    })


    return (
        <div className="position-fixed top-0 end-0 p-5" style={{ zIndex: 1000 }}>

            { messages.map((message)=>(
                <div 
                    key={message.id} 
                    ref={(el)=> toastRefs.current[message.id]=el} 
                    className="toast" 
                    role="alert" 
                    aria-live="assertive" 
                    aria-atomic="true"
                >
                    <div className={`toast-header ${message.status==='success'? 'bg-success':'bg-danger'} text-white`}>
                        <strong className="me-auto"> { message.status === 'success'? '成功' :'失敗'}</strong>
                        <button
                            onClick={()=> handleDismiss(message.id)}
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                        ></button>
                        </div>
                        <div className="toast-body">{message.text}</div>
                </div>
            ))}
        </div>

    )
};