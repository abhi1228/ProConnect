import  { createSlice } from "@reduxjs/toolkit";
import { getAllComents, getAllPosts } from "../../actions/postAction";


const initialState={
    posts:[],
    postFetched:false,
    isError:false,
    loggedIn:false,
    isLoading:false,
    message:"",
    comments:[],
    postId:"",
    commentPostId:"",
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        },
        setPostId:(state,action)=>{
            state.postId=action.payload.post_id;
            state.commentPostId=action.payload.post_id;
            console.log(state.commentPostId)
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.message="Fetching all the posts";
            state.isLoading=true;
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.postFetched=true,
            state.posts=action.payload.posts.reverse()
            console.log('here',state.posts)
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(getAllComents.fulfilled,(state,action)=>{
            state.postId=action.payload.post_id;
            state.comments=action.payload.comments;
        })
    }
})

export const  {reset,resetPostId,setPostId}=postSlice.actions;

export default postSlice.reducer;