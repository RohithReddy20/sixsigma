import React, { useState } from "react";
import { collection, doc, getFirestore, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import firebase from '../../utils/init-firebase';
import Swal from "sweetalert2";
import "../Sign.css";
import "../WSC.css";

function WorkSpaceCreation(props) {
  const [workspace, setWorkspace] = useState(null);
  const { setCurrWorkspace } = props;

  const navigate = useNavigate();

  const db = getFirestore();
  const workspaceRef = collection(db, "workspaces");
  const usersRef = collection(db, `workspaces/${workspace}/users`);
  const channelsRef = collection(db, `workspaces/${workspace}/channels`);
  const generalChannelUsersRef = collection(db, `workspaces/${workspace}/channels/General/users`);
  const announcementsRef = collection(db, `workspaces/${workspace}/announcements`);
  const GENERAL_CHANNEL_NAME = "General";


  const addWorkspace = async () => {
    try {
      // WORKSPACE
      await setDoc(doc(workspaceRef, workspace), {
        name: workspace
      });

      // CHANNELS
      await setDoc(doc(channelsRef, GENERAL_CHANNEL_NAME), {
        name: GENERAL_CHANNEL_NAME,
        isPrivate: false,
        admins: [firebase.auth().currentUser.uid],
        createdBy: {
          uid: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.displayName,
          timeStamp: serverTimestamp()
        }
      });
      await setDoc(doc(generalChannelUsersRef, firebase.auth().currentUser.uid), {
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        thumbImage: firebase.auth().currentUser.photoURL
      });

      // USERS
      await setDoc(doc(usersRef, firebase.auth().currentUser.uid), {
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        thumbImage: firebase.auth().currentUser.photoURL,
        channels: [GENERAL_CHANNEL_NAME],
        roles: ["admin"]
      });

      // ANNOUNCEMENTS
      await setDoc(doc(announcementsRef), {});
      Swal.fire("Workspace created successfully");

      setCurrWorkspace(workspace);
      navigate('/invite');
    } catch (error) {
      console.log("Failed to add workspace " + error);
    }
  }

  return (
    <div className="workspace">
      <div className="logo">
        <img src="./images/company-logo-2.svg" alt="logo" />
      </div>
      <div className="create">
        <h2>Welcome to Crown</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="workspaceName"
            placeholder="Enter the name of the workspace"
            onChange={(event) => {
              setWorkspace(event.target.value);
            }}
          />
        </div>
        <button
          onClick={addWorkspace}
          type="submit"
          className="btn btn-primary"
        >
          Create a new workspace
        </button>
      </div>
    </div>
  );
}

export default WorkSpaceCreation;
