import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [ ],
  };

const toastSlice = createSlice({
    name:'toast',
    initialState,
    reducers:{
      pushMessage(state, action){
        //將 actions 解構 text 跟 status 資料後匯出
        const { text , status } = action.payload;

        //透過 Date.now 設定 id ( 時間戳 ）
        const id = Date.now();

        state.messages.push({
          id,
          text,
          status
        })
      },
      //設定刪除存在Store裡的舊吐司訊息
      removeMessage(state, action){
        const message_id = action.payload;

        const index = state.messages.findIndex((message)=> message_id === message_id );

        if (index !== -1){
          state.messages.splice(index,1);
        }
      }
    }
    
})

export const { pushMessage , removeMessage  } = toastSlice.actions;

export default toastSlice.reducer;