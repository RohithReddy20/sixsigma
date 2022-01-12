import React, { useEffect, useReducer, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import { Grid, Header, Menu, Sticky, Icon } from 'semantic-ui-react';
import ChannelContent from "./ChannelContent";
import './Channels.css';
import { Link, useNavigate, useParams } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

import firebase from '../../utils/init-firebase';
import { onSnapshot, collection, getFirestore, doc, setDoc, getDoc, updateDoc, getDocs, serverTimestamp, deleteDoc, arrayRemove } from 'firebase/firestore';
import AddChannelModal from "./AddChannelModal";
import AddChannelTeamModal from "./AddChannelTeamModal";

const Channels = (props) => {
  const { currWorkspace } = props;
  const { channelname } = useParams();
  const [channels, setChannels] = useState([]);
  const [addChannelModalOpen, setAddChannelModalOpen] = useState(false);
  const [addChannelTeamModalOpen, setAddChannelTeamModalOpen] = useState(false);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);

  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    if (!currWorkspace) {
      console.log('NO WORKSPACE SELECTED! NAVIGATING TO HOMEPAGE');
      navigate('/');
    }
    if (currWorkspace) {
      const workspaceRef = doc(db, "workspaces", currWorkspace);
      const usersChannels = onSnapshot(
        doc(workspaceRef, "users", firebase.auth().currentUser.uid),
        (doc) => {
          const { channels, roles } = doc.data();
          setChannels(channels);
        });
    }
  }, []);

  const addChannel = async (channelData) => {
    const { name, desc, isPrivate } = channelData;
    if (currWorkspace) {
      let docData = {
        name: name,
        isPrivate, isPrivate,
        admins: [firebase.auth().currentUser.uid],
        createdBy: {
          uid: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.displayName,
          timeStamp: serverTimestamp()
        }
      }
      if (desc.length != 0) {
        docData = {
          ...docData,
          desc: desc
        }
      }

      const workspaceRef = doc(db, "workspaces", currWorkspace);
      await setDoc(
        doc(workspaceRef, "channels", name),
        docData
      );
      console.log("NEW CHANNEL ADDED");
      navigate(`/channels/${name}`);

      await updateChannelUsers({
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        thumbImage: firebase.auth().currentUser.photoURL
      }, name);
      await updateWorkspaceUsers(firebase.auth().currentUser.uid, name, 'admin');

      const currWorkspaceUsers = await getWorkspaceUsers(currWorkspace);
      if (isPrivate) {
        // ADD CHANNEL TEAM ONLY FOR PRIVATE CHANNELS
        setAddChannelTeamModalOpen(true);
      } else {
        // ADD ALL WORKSPACE USERS FOR PUBLIC CHANNELS
        workspaceUsers.forEach(async (user) => {
          if (user.uid != firebase.auth().currentUser.uid) {
            await updateWorkspaceUsers(user.uid, name, 'moderator');
            await updateChannelUsers(user, name);
          }
        });
      }
    }
  }

  const deleteUserFromChannel = async (userId, channelName) => {
    if (currWorkspace) {
      // UPDATING USERS COLLECTION INSIDE CHANNELS COLLECTION
      const workspaceRef = doc(db, "workspaces", currWorkspace);
      const channelRef = doc(workspaceRef, "channels", channelName);
      await deleteDoc(doc(channelRef, "users", userId));

      // UPDATING THE USERS COLLECTION INSIDE WORKSPACE COLLECTION
      const userRef = doc(workspaceRef, "users", userId);
      const userSnap = await getDoc(userRef);
      let channelIndex = null;
      if (userSnap.exists()) {
        const userData = userSnap.data();
        for (let i = 0; i < userData["channels"].length; i++) {
          if (userData["channels"][i] === channelName) {
            channelIndex = i;
            break;
          }
        }

        // REMOVING
        if (channelIndex || channelIndex == 0) {
          let newChannels = userData["channels"];
          newChannels = (newChannels.slice(0, channelIndex)).concat(newChannels.slice(channelIndex + 1));
          let newRoles = userData["roles"];
          newRoles = (newRoles.slice(0, channelIndex)).concat(newRoles.slice(channelIndex + 1));
          await updateDoc(userRef, {
            "channels": newChannels,
            "roles": newRoles
          });
        }
      } else {
        console.log("No such document!");
      }

      // UPDATING THE ADMINS FIELD OF THE CHANNEL
      await updateDoc(channelRef, {
        "admins": arrayRemove(userId)
      });
    }
  }

  const updateChannelUsers = async (user, channelName) => {
    const channelsUsersRef = collection(db, `workspaces/${currWorkspace}/channels/${channelName}/users`);
    await setDoc(doc(channelsUsersRef, user.uid), {
      uid: user.uid,
      name: user.name,
      thumbImage: user.thumbImage
    });
  }

  const updateWorkspaceUsers = async (uid, channelName, role) => {
    if (currWorkspace) {
      const workspaceRef = doc(db, "workspaces", currWorkspace);
      const workspaceUserRef = doc(workspaceRef, "users", uid);
      const workspaceUserSnap = await getDoc(workspaceUserRef);
      if (workspaceUserSnap.exists()) {
        const { channels, roles } = workspaceUserSnap.data();
        await updateDoc(workspaceUserRef, {
          channels: [...channels, channelName],
          roles: [...roles, role]
        });
        console.log("UPDATED WORKSPACE USERS");
      } else {
        console.log("No such document!");
      }
    }
  }

  const handleAddButton = () => {
    setAddChannelModalOpen(true);
  }

  const getWorkspaceUsers = async (workspace_name) => {
    const workspaceRef = doc(db, "workspaces", workspace_name);
    const usersSnapshot = await getDocs(collection(workspaceRef, "users"));
    let newWorkspaceUsers = [];
    usersSnapshot.forEach((doc) => {
      doc.data()
      newWorkspaceUsers.push(doc.data());
    });
    setWorkspaceUsers(newWorkspaceUsers);
  }

  const addUsersToChannel = async (selectedUsers) => {
    for (const [key, value] of Object.entries(selectedUsers)) {
      if (value.uid != firebase.auth().currentUser.uid) {
        await updateWorkspaceUsers(value.uid, channelname, 'moderator');
        await updateChannelUsers(value);
      }
    }
  }

  const createChannelThreads = async (channelName, msg) => {
    const channelThreadsRef = collection(db, `workspaces/${currWorkspace}/channels/${channelName}/threads`);
    await setDoc(doc(channelThreadsRef, uuidv4()), {
      ...msg,
      last_message_time: serverTimestamp()
    });
  }

  const deleteChannelThreads = async (channelName, threadId) => {
    const workspaceRef = doc(db, "workspaces", currWorkspace);
    const channelRef = doc(workspaceRef, "channels", channelName);
    await deleteDoc(doc(channelRef, "threads", threadId));
  }

  return (
    <Grid className=""
      divided="vertically"
      style={{ height: '100%', margin: '0' }}>
      <Grid.Row
        style={{ padding: '0', height: '12%' }}>
        <Navbar />
      </Grid.Row>
      <Grid.Row columns="equal" stretched
        style={{ padding: '0', height: '88%', maxHeight: '88%' }}>
        <Grid.Column tablet={3} computer={2}
          style={{ padding: '0', margin: '0' }}>
          <Sidebar />
        </Grid.Column>
        <Grid.Column
          style={{ textAlign: 'left', padding: '0', margin: '0', maxHeight: '100%' }}>

          {/* CHANNELS HERE! */}
          <Grid
            style={{ margin: '0', maxHeight: '100%' }}>
            <Grid.Column tablet={4} computer={3}
              className="channels-column">
              <Grid.Row className="channels-column-header">
                <h3 style={{ display: 'inline', margin: '0', fontSize: '1.5rem' }}>Channels</h3>
                <button onClick={handleAddButton}>
                  <Icon name="add" /> Add
                </button>
              </Grid.Row>
              <Grid.Row stretched
                className="channels-menu">
                {channels ?
                  channels.map((channel) => (
                    <Link
                      key={channel}
                      className={`channels-menu-item ${channelname ? (channelname === channel ? 'channels-menu-active' : '') : ''}`}
                      to={`/channels/${channel}`}>
                      <div className="channels-menu-item-content">
                        <Icon name="hashtag" /> {channel}
                      </div>
                    </Link>
                  ))
                  : "NO CHANNELS YET"}
              </Grid.Row>
            </Grid.Column>
            <Grid.Column tablet={12} computer={13}
              className="channels-column">
              {(currWorkspace && channelname) ?
                <ChannelContent
                  currWorkspace={currWorkspace}
                  channelname={channelname}
                  deleteUserFromChannel={deleteUserFromChannel}
                  createChannelThreads={createChannelThreads}
                  deleteChannelThreads={deleteChannelThreads} />
                :
                <>YOUR CHANNEL COMES HERE</>}
            </Grid.Column>

            <AddChannelModal
              addChannelModalOpen={addChannelModalOpen}
              setAddChannelModalOpen={setAddChannelModalOpen}
              addChannel={addChannel} />
            <AddChannelTeamModal
              addChannelTeamModalOpen={addChannelTeamModalOpen}
              setAddChannelTeamModalOpen={setAddChannelTeamModalOpen}
              workspaceUsers={
                workspaceUsers.filter(user => user.uid != firebase.auth().currentUser.uid)
              }
              addUsersToChannel={addUsersToChannel} />
          </Grid>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Channels;