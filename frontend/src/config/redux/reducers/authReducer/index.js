import  { createSlice,builder } from "@reduxjs/toolkit";
import  { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequest, loginUser, registerUser }from "../../actions/authAction";

const initialState={
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    isTokenThere:false,
    all_user:[],
    all_profile_fetched:false
}

const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        reset:()=>initialState,
        handelLoginUser:(state)=>{
            state.message.message="Hello";
        },
        emptyMessage:(state)=>{
            state.message="";
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere=true;
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere=false;
        }
    },

    extraReducers:(builder)=>{
        builder
         .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.message={
                message:"Logging Inn.."
            };
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message={
                message:"Login is Successful"
            }
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message={
                message:action.payload
            };
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true;
            state.message={
                message:"Registering you.."
            }
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=false;
            state.message={
                message:"Registration is Successful, Please login"
            }
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message={
                message:action.payload
            }
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
           // console.log("profileFetched:",state.profileFetched);
            state.user=action.payload.userProfile;
            //console.log('user',state.user)
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.all_user=action.payload.profiles;
           // console.log('all-users:',state.all_user);
        })
        .addCase(getConnectionRequest.fulfilled,(state,action)=>{
            state.connections=action.payload;
        })
        .addCase(getConnectionRequest.rejected,(state,action)=>{
            state.message=action.payload;
        })
        .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
            state.connectionRequest=action.payload;
        })
        .addCase(getMyConnectionRequest.rejected,(state,action)=>{
            state.message=action.payload;
        })
        

    }
});
export const {reset,emptyMessage,setTokenIsNotThere,setTokenIsThere}=authSlice.actions
export default authSlice.reducer;