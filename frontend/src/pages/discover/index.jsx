import { BASE_URL } from '@/config'
import { getAboutUser, getAllUsers } from '@/config/redux/actions/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css";
import { useRouter } from 'next/router'

const DiscoverPage = () => {

  const authState=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const router=useRouter();

  useEffect(()=>{
    
    if(!authState.profileFetched){
        dispatch(getAllUsers());
       
    }
    //dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  },[])
  return (
    <UserLayout>
    <DashboardLayout>
      <h2>Discover</h2>

      <div className={styles.allUserProfile}>
        {authState.profileFetched && authState.all_user.map((user)=>{
          
          return (
           
            <div onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }} key={user.userId._id} className={styles.userCard}>
              <img className={styles.userCard__image} src={`${BASE_URL}/${user.userId?.profilePicture}`} alt="" />
              <div>
              <h1>{user.userId?.name}</h1>
              <p>{user.userId?.email}</p>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
</UserLayout>
  )
}

export default DiscoverPage