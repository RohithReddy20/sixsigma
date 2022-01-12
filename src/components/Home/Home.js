import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import firebase from '../../utils/init-firebase';
import { db } from "../../utils/init-firebase";
import { collection, getDocs, query, where } from 'firebase/firestore';

import "./Home.css";

function Home() {

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  // const db = getFirestore();

  // const [users, setUsers] = useState([]);
  // const userCollectionRef = collection(db, "users");

  // useEffect(() => {

  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate('/');
  //     } else {
  //       navigate('/signin');
  //     }
  //   })

  //   const getUsers = async () => {
  //     const data = await getDocs(userCollectionRef);
  //     setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  //   }
  //   getUsers();

  // }, []);

  // useEffect(() => {
  //   const zeptousers = async () => {
  //     const querySnapshot = await getDocs(query(collection(db, "users"), where("workspaces", "array-contains", "zepto")))
  //     querySnapshot.forEach(doc => {
  //       // console.log(doc.id, " => ", doc.data());
  //     })
  //   }
  //   zeptousers();
  // }, []);



  return (
    <div className="home-page">
      <div className="txt">
        <h1>{currentUser && currentUser.email}</h1>
        {currentUser && (
          <><button
            onClick={() => {
              logout();
              navigate("/signin");
            }}
          >
            Sign out
          </button>
            <button
              onClick={() => {
                navigate("/create-workspace");
              }}
            >
              Create Work Space
            </button>
            <button
              onClick={() => {
                navigate("/invite");
              }}
            >
              Invite
            </button>
            <button
              onClick={() => {
                navigate("/announcements");
              }}
            >
              Announcements
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default Home;
