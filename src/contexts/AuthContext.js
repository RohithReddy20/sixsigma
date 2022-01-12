/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../utils/init-firebase";
import firebase from "firebase/compat/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";

import Swal from "sweetalert2";

const AuthContext = createContext({
  currentUser: null,
  signInWithGoogle: () => Promise,
  login: () => Promise,
  register: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
});

export const useAuth = () => useContext(AuthContext);



export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return unsubscribe
  
  }, []);

  // useEffect(() => {
  //   console.log("The user is", currentUser);
  // }, [currentUser]);
  // console.log("The user is", currentUser);
  //signup user
  async function signup(email, password) {
    try {
      const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await userCred.user.sendEmailVerification({
         url: `http://localhost:3000`,
      });
      return {user: userCred.user};
    }catch(e) {
      //if mail already in use proceed to login
      if(e.message.includes("email-already-in-use")){
        Swal.fire("Email already in use");
        window.location.href = "http://localhost:3000/signin";
      }

       console.log(e);
    }
 }
  function login(email, password) {
     signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
       const user = userCredential.user;
      //  setCurrentUser(user);
       }).catch((error) => {
        //  console.log(error);
         if(error.message.includes("user-not-found")){
           Swal.fire("Please register to continue");
           window.location.href = "http://localhost:3000/signup";
         }
       });
  }

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function forgotPassword(email) {
    try {
      await firebase.auth().sendPasswordResetEmail(email,{url: `http://localhost:3000/`});
      Swal.fire("Password reset email sent");
    }catch(error) {
      console.log(error);
    }
  }

  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function logout() {
    return signOut(auth);
  }
  function signInWithEmailLink(email, url) {
    return signInWithEmailLink(auth, email, url);
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    return signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("signed in with Google")
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // console.log(error);
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

  }

  const value = {
    currentUser,
    signup,
    signInWithGoogle,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
  return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>);
}
