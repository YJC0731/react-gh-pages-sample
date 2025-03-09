import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";

export default function Toast ( ) {

    //透過 message 渲染 Toast
    const messages = useSelector ( ( state ) => state.toast.messages);

    //新增吐司實例
    const toastRefs = useRef({});

    //透過 useEffect 遍歷訊息
    useEffect(()=>{
        messages.forEach((message)=>{
            const messageElement = toastRefs.current[message.id];

            if(messageElement){
                const totasInstance = new BsToast(messageElement);
                totasInstance.show();
            }
        })
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