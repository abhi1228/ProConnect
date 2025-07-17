import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/actions/postAction';
import { getConnectionRequest, sendConnectionRequest } from '@/config/redux/actions/authAction';


const ViewProfilePage = ({userProfile}) => {
   // console.log("userprofile:",userProfile);
    const router =useRouter();
    const postReducer=useSelector((state)=>state.postsReducer);
    //console.log("posts array:",postReducer.posts);
    const dispatch=useDispatch();

    const authSate=useSelector((state)=>state.auth);
    const [userPosts,setuserPosts]=useState([]);
    const [isCurrentUserInConnection,setIsCurrentUserInConnection]=useState(false);
    const [isConnectionNull,setIsConnectionNull]=useState(true);
    const getUserPost=async()=>{
        await dispatch(getAllPosts());
        console.log("comming posts after calling getAllPosts",postReducer.posts)
        await dispatch(getConnectionRequest({token:localStorage.getItem("token")}));
    }
    useEffect(()=>{
        getUserPost();
    },[])
    useEffect(() => {
        if (postReducer.posts.length && router.query.username) {
          const filteredPosts = postReducer.posts.filter(
            (post) => post.userId?.username === router.query.username
          );
          setuserPosts(filteredPosts);
        }
      }, [postReducer.posts, router.query.username]);

    useEffect(()=>{
       console.log(authSate.connections,userProfile.userId._id);
       if (authSate.connections.length > 0) 
        {
            if(authSate.connections.some(user=>user.connectionId._id === userProfile.userId._id)){
                    setIsCurrentUserInConnection(true);
                    if(authSate.connections.find(user=>user.connectionId._id === userProfile.userId._id).
                    status_accepted === true){
                        setIsConnectionNull(false);
                    }
            }
        }
        
        if(authSate.connectionRequest.some(user=>user.userId._id === userProfile.userId._id)){
                setIsCurrentUserInConnection(true);
                if(authSate.connectionRequest.find(user=>user.userId._id === userProfile.userId._id).
                status_accepted === true){
                    setIsConnectionNull(false);
                }
        }
    
    },[authSate.connections])
    
    

  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.backDropContainer}>
                    <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="pp" />
                </div>
                <div className={styles.profileContainer__details}>
                    <div className={styles.profileContainer__flex}>
                            <div style={{flex:"0.8"}}>
                                    <div style={{display:"flex",width:"fit-content",alignItems:"center"}}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                                    </div>
                                    <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                                    {isCurrentUserInConnection ?
                                    <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected" }</button> :
                                    <button onClick={()=>{
                                        dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))
                                    }} className={styles.connectBtn}>Connect</button>} 
                                        <div style={{cursor:"pointer"}} onClick={async()=>{
                                                const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                                window.open(`${BASE_URL}/${response.data.message}`,"_blank")
                                        }}>
                                        <svg style={{width:"1.2rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                                        </div> 
                                    </div>
                                    <div>
                                        <p>{userProfile.bio}</p>
                                    </div>
                            </div>
                            <div style={{flex:"0.2"}}>
                                <h3>Recent Activity</h3>
                                {
                                    userPosts.map((post)=>{
                                        return (
                                            <div key={post._id} className={styles.postCard}>
                                                <div className={styles.card}>
                                                    <div className={styles.card__profileContainer}>
                                                        {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" />: <div style={{width:"3.4rem",height:"3.4rem"}}></div>}
                                                    </div>
                                                     <p>{post.body}</p>
                                                  </div>   
                                            </div>
                                        )
                                    })
                                }
                            </div>
                    </div>
                </div>
                <div className="workHistroy">
                    <h4>Work Histroy</h4>
                    <div className={styles.workHistoryContainer}>
                            {userProfile.pastWork.map((work,index)=>{
                                return (
                                    <div key={index} className={styles.workHistoryCard}>
                                        <p style={{fontWeight:"bold",display:"flex",alignItems:"cneter",gap:"0.8rem"}}>
                                            {work.company} - {work.position}
                                        </p>
                                        <p>{work.years} years</p>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    </UserLayout>    
        
  )
}

export async function getServerSideProps(context){
    console.log("from view");
    console.log(context.query.username);
    const request = await clientServer.get('/user/get_profile_based_on_user',{
        params:{
            username:context.query.username
        }
    });
    const response=await request.data 
    console.log(response);
    return { props: { userProfile:response.profile } }
}

export default ViewProfilePage