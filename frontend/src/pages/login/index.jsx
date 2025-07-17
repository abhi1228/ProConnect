import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "@/config/redux/actions/authAction";
import { emptyMessage } from "@/config/redux/reducers/authReducer";
const LoginComponent = () => {
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const authState = useSelector((state) => state.auth);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [username,setUsername]=useState("");

  const router = useRouter();
 const dispatch=useDispatch();

  const handelRegister =()=>{
    dispatch(registerUser({username,password,email,name}))
  }

  const handelLogin=()=>{
    console.info("loginn..")
    dispatch(loginUser({email,password}))
  }
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);
  useEffect(() => {
    dispatch(emptyMessage())
  }, [userLoginMethod]);
  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }
  },[])
  return (
    <UserLayout>
      
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardLeft__heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p style={{color:authState.isError ? "red" : "green"}}>{authState.message.message}</p>

            <div className={styles.inputContainer}>
              {!userLoginMethod && 
              <div className={styles.inputRow}>
                <input
                  onChange={(e)=>setUsername(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Username"
                />
                <input
                  onChange={(e)=>setName(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Name"
                />
              </div>}
              <input
                  onChange={(e)=>setEmail(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Email"
                />
                <input
                  onChange={(e)=>setPassword(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Password"
                />

                <div onClick={()=>{
                  if(userLoginMethod){
                    handelLogin();
                  }else{
                    handelRegister();
                  }
                }} className={styles.buttonWithOutline}>{userLoginMethod ? "Sign In" : "Sign Up"}</div>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <div style={{color:"white"}}>
              {userLoginMethod ? <p>Dont't have an account</p> : <p>Already have an account</p>}
              <div style={{color:"black",textAlign:"center"}} className={styles.buttonWithOutline} onClick={()=>{
                setUserLoginMethod(!userLoginMethod);
              }}>
                <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
