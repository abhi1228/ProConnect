import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "@/config/redux/actions/authAction";
import { BASE_URL, clientServer } from "@/config";
import { getAllPosts } from "@/config/redux/actions/postAction";

const ProfilePage = () => {
  const [ismodalOpen, setIdModalOpen] = useState(false);
  const [inputData,setInputData]=useState({company:"",position:"",years:""});

  const handelWorkInputChange=(e)=>{
    const {name,value}=e.target;
    setInputData({...inputData,[name]:value});
  }
  const [userProfile, setUserProfile] = useState({});
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postsReducer);
  const [userPosts, setUserPosts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);
  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      console.log(postReducer);
    }
  }, [authState.user]);
  useEffect(() => {
    if (authState.user != undefined) {
      const filteredPosts = postReducer.posts.filter(
        (post) => post.userId?.username === authState.user.userId.username
      );
      console.log(filteredPosts);
      setUserPosts(filteredPosts);
    }
  }, [postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                type="file"
                id="profilePictureUpload"
                hidden
              />
              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt="pp"
              />
            </div>
            <div className={styles.profileContainer__details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>
                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    ></textarea>
                  </div>
                </div>
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card__profileContainer}>
                            {post.media !== "" ? (
                              <img src={`${BASE_URL}/${post.media}`} alt="" />
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="workHistroy">
              <h4>Work Histroy</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "cneter",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years} years</p>
                    </div>
                  );
                })}
                <button
                  className={styles.addMoreButton}
                  onClick={() => {
                    setIdModalOpen(true);
                  }}
                >
                  Add Work
                </button>
              </div>
            </div>
            {userProfile != authState.user && (
              <div
                onClick={() => {
                  updateProfileData();
                }}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}
        {ismodalOpen && (
          <div
            onClick={() => {
              setIdModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allCommentsContainer}
            >
              <input
                onChange={handelWorkInputChange}
                name="company"
                className={styles.inputField}
                type="text"
                placeholder="Enter Company"
              />
              <input
                onChange={handelWorkInputChange}
                name="position"
                className={styles.inputField}
                type="text"
                placeholder="Enter Position"
              />
              <input
                onChange={handelWorkInputChange}
                name="years"
                className={styles.inputField}
                type="number"
                placeholder="Years"
              />
              <div
                onClick={() => {
                  setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
                  setIdModalOpen(false);
                }}
                className={styles.updateProfileBtn}
              >
               Add Work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
};

export default ProfilePage;
