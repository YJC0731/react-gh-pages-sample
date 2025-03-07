import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './toastSlice'

const store = configureStore({
    //此處reducer 不用加 s
    reducer:{
        toast: toastReducer

    }
})

export default store;