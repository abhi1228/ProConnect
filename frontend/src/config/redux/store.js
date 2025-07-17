
/*
step for state management
1.submit action
2.handel actions in reducer
3.register the reducers in store
*/

import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer"
import postReducer from "./reducers/postReducer"
export const store=configureStore({
    reducer:{
        auth:authReducer,
        postsReducer:postReducer,
    }
})


