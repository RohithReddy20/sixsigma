import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Swal from "sweetalert2";
import firebase, { db } from "../../utils/init-firebase";
import { Grid } from 'semantic-ui-react';
import { send } from "emailjs-com";

// import { useAuth } from "../../contexts/AuthContext";
// import {
//   collection,
//   getDocs
// } from "firebase/firestore";

import "./Alert.css";
import "../Sign.css";

function Invitation() {
  const [loading, setLoading] = useState(false);

  const [toSend, setToSend] = useState({
    from_name: "",
    to_name: "",
    message: "",
    reply_to: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    send(
      "service_2pd0f4s",
      "template_5rxdt9p",
      toSend,
      "user_EWJjfqCH5EqUoW1VoiKVf"
    )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
  };

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  // const { currentUser } = useAuth();

  // let workspace = null;

  // const workspaceRef = collection(db, "workspaces");

  // const getWorkspaces = async () => {
  //   getDocs(workspaceRef)
  //   .then((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       if(doc.data().admin===currentUser.uid) {
  //         workspace =  doc.id
  //       }

  //     });
  //     if(workspace==null) {
  //         Swal.fire("You don't have workspace");
  //         setLoading(false);
  //         return;
  //       }
  //       console.log(workspace);
  //     return workspace;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const createDynamicLink = async () => {
    setLoading(true);
    await fetch(
      "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" +
      process.env.REACT_APP_FIREBASE_API_KEY,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          dynamicLinkInfo: {
            domainUriPrefix: "https://sixsigmadevenv.page.link",
            link:
              "https://www.sixsigmadevenv.page.link/invite?workspace=qwerty&email=" +
              firebase.auth().currentUser.email,
            androidInfo: {
              androidPackageName: "com.example.alphare_property_manager",
            },
            iosInfo: {},
          },
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        navigator.clipboard.writeText(data.shortLink);
        Swal.fire("Link copied to clipboard");
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    // <div>
    //   <Navbar />
    //   <Sidebar />
    // </div>
    <Grid className=""
      divided="vertically"
      style={{ margin: '0' }}>
      
        
        <Navbar />
      
      <Grid.Row columns="equal" stretched
        style={{ padding: '0', height: '88%' }}>
        <Grid.Column tablet={3} computer={2}
          style={{ padding: '0', margin: '0' }}>
          <Sidebar />
        </Grid.Column>
        <Grid.Column
          style={{ textAlign: 'left', padding: '0', margin: '0' }}>

          <div className="invitation-container">
            <h2>Who else is working with you</h2>
            <p>Invite your coworkers to join your workspace</p>
            <div className="email-group">
              <span>
                <img src="./images/IconMail.svg" alt="mail-icon" />
              </span>

              <input
                type="text"
                className="add-email"
                placeholder="Add an email address"
                autoComplete="on"
              />
            </div>

            <button disabled={loading} className="send-invitation" type="submit">
              Send an Invite
            </button>
            <div className="spt">
              <h2>OR</h2>
              <button
                disabled={loading}
                onClick={createDynamicLink}
                className="share-invitation"
                type="submit"
              >
                Share your invitation link
              </button>
            </div>
          </div>


        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default Invitation;
