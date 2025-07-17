import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts=createAsyncThunk(
    "posts/getAllPost",async(_,thunkAPI)=>{
        try {
            const response=await clientServer.get('/posts');
            console.log("get all post called")
            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
});

export const createPost=createAsyncThunk("user/createPost",async(userData,thunkAPI)=>{
    const {file,body}=userData;
    try {
        const formData=new FormData();
        formData.append('token',localStorage.getItem('token'));
        formData.append('body',body);
        formData.append('media',file);
        const response=await clientServer.post('/post',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });
        console.log(response)
        if(response.status === 200){
            return thunkAPI.fulfillWithValue(response.data);
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const deletePost=createAsyncThunk(
    "post/deletePost",async(postData,thunkAPI)=>{
            try {
                const response=await clientServer.post('/delete_post',postData);
                if(response.status === 200){
                    return thunkAPI.fulfillWithValue({message:"Post Deleted"})
                }
            } catch (error) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
    
});

export const incrementLikes=createAsyncThunk(
    "post/incrementLikes",async(post,thunkAPI)=>{
        try {
            const response=await clientServer.post('/increment_post_like',{
                post_id:post.post_id
            });
            return thunkAPI.fulfillWithValue({message:"Like Incremented"})
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
})

export const getAllComents=createAsyncThunk(
    "post/getAllComents",async(post,thunkAPI)=>{
        try {
           // console.log('comment_post_id:',post);
            const response=await clientServer.post('/get_comments',{},{
               params:{
                post_id:post.post_id
               }
            });
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
})

export const postComment=createAsyncThunk(
    "post/postComment",async(commentData,thunkAPI)=>{
        try {
            console.log({token:localStorage.getItem("token"),
                post_id:commentData.post_id,
                commentBody:commentData.body})
            const response=await clientServer.post('/comment',{
                token:localStorage.getItem("token"),
                post_id:commentData.post_id,
                commentBody:commentData.body
            });

            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
})

