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
      }
    }
    
})

export const { pushMessage } = toastSlice.actions;

export default toastSlice.reducer;