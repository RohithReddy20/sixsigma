import React, { useEffect, useState } from "react";

import firebase from '../../utils/init-firebase';
import { onSnapshot, collection, getFirestore, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { Grid, Header, Icon, Input, Menu } from "semantic-ui-react";

import './ChannelContent.css';
import ChannelContentHeader from "./ChannelContentHeader";
import ChannelInfo from "./ChannelInfo";
import ChannelThreads from "./ChannelThreads";
import InputWithMentions from "./InputWithMentions";

import { EditorState, convertToRaw } from 'draft-js';

// const MENTIONS = [
//   {
//     name: "Jyoti Puri",
//     link: "https://twitter.com/jyopur",
//     avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400"
//   },
//   {
//     name: "Max Stoiber",
//     link: "https://twitter.com/mxstbr",
//     avatar: "https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg"
//   },
//   {
//     name: "Nik Graf",
//     link: "https://twitter.com/nikgraf",
//     avatar: "https://avatars0.githubusercontent.com/u/223045?v=3&s=400"
//   }
// ];

const ChannelContent = (props) => {
  const { currWorkspace, channelname, deleteUserFromChannel, createChannelThreads, deleteChannelThreads } = props;

  const [channelData, setChannelData] = useState({ name: channelname });
  const [channelUsers, setChannelUsers] = useState([]);
  const [channelThreads, setChannelThreads] = useState([]);
  const [activeMenu, setActiveMenu] = useState("CHAT");
  const [channelInfoModalOpen, setChannelInfoModalOpen] = useState(false);
  // const [input, setInput] = useState({});
  const [isSelectingThreads, setIsSelectingThreads] = useState(false);
  const [selectedThreads, setSelectedThreads] = useState({});

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const db = getFirestore();

  useEffect(async () => {
    if (currWorkspace && channelname) {
      const channelRef = doc(db, `workspaces/${currWorkspace}/channels`, channelname);
      const channelSnap = await getDoc(channelRef);
      if (channelSnap.exists()) {
        setChannelData(channelSnap.data());

        // get "USERS" collection of this channel
        const usersRef = collection(db, `workspaces/${currWorkspace}/channels/${channelname}/users`);
        const usersCol = onSnapshot(usersRef, (snapshot) => {
          const tmpUsers = [];
          snapshot.forEach((doc) => {
            tmpUsers.push(doc.data());
          });
          try {
            setChannelUsers(tmpUsers);
          } catch (err) {
            console.log(err);
          }
        });

        // get "THREADS" collection of this channel
        const threadsRef = collection(db, `workspaces/${currWorkspace}/channels/${channelname}/threads`);
        const threadsQuery = query(threadsRef, orderBy("last_message_time"));
        const threadsCol = onSnapshot(threadsQuery, (snapshot) => {
          const tmpThreads = [];
          snapshot.forEach((doc) => {
            tmpThreads.push({
              ...doc.data(),
              threadId: doc.id
            });
          });
          setChannelThreads(tmpThreads);
        });
      } else {
        console.log("No such document!");
      }

    }
  }, [channelname]);

  const handleMenuItemClick = (e, { name }) => {
    setActiveMenu(name);
  }

  // const handleInputChange = (e) => {
  //   setInput(e.target.value);
  // }

  const handleSend = async () => {
    let msg = {
      sender_id: firebase.auth().currentUser.uid,
      sender_name: firebase.auth().currentUser.displayName,
      sender_thumb: firebase.auth().currentUser.photoURL,
      ...extractDataAndMentions()
    }
    if ((msg.text).length > 0) {
      await createChannelThreads(channelname, msg);
      // setInput({});
      setEditorState(() => EditorState.createEmpty());
    }
  }

  const handleSelectedDelete = async () => {
    if ((Object.entries(selectedThreads)).length > 0) {
      for (const [key, value] of Object.entries(selectedThreads)) {
        await deleteChannelThreads(channelname, key);
      }
    }
    handleCancel();
  }

  const handleCancel = () => {
    setIsSelectingThreads(false);
    setSelectedThreads([]);
  }

  const extractDataAndMentions = () => {
    let data = {
      text: '',
      mentions: []
    };
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    data['text'] = (raw['blocks'][0])['text'];
    const entityRanges = (raw['blocks'][0])['entityRanges'];
    const entityMap = raw['entityMap'];
    for (let i = 0; i < entityRanges.length; i++) {
      data['mentions'].push({
        uid: ((entityMap[i]['data'])['mention'])['uid'],
        offset: entityRanges[i]['offset'],
        length: entityRanges[i]['length']
      });
    }
    return data;
  };

  return (
    <>
      <ChannelContentHeader
        channelData={channelData}
        channelUsers={channelUsers}
        activeMenu={activeMenu}
        handleMenuItemClick={handleMenuItemClick}
        setChannelInfoModalOpen={setChannelInfoModalOpen}
        deleteUserFromChannel={deleteUserFromChannel}
        setIsSelectingThreads={setIsSelectingThreads} />
      <ChannelThreads
        channelData={channelData}
        channelUsers={channelUsers}
        channelThreads={channelThreads}
        isSelectingThreads={isSelectingThreads}
        selectedThreads={selectedThreads}
        setSelectedThreads={setSelectedThreads} />
      <Grid.Row className="channels-contents-footer">
        {isSelectingThreads ?
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon name="delete" circular inverted
                onClick={handleCancel} />
              <span style={{ margin: '0 20px', color: 'grey' }}>
                {`${Object.entries(selectedThreads).length} selected`}
              </span>
            </div>
            <div>
              {/* delete */}
              <Icon name="box" size="large" style={{ margin: '0 24px' }}
                onClick={handleSelectedDelete} />
              {/* forward */}
              <Icon name="mail forward" size="large" />
            </div>
          </>
          :
          <>
            <Icon name="add circle" size="big"
              onClick={handleSend} />
            {/* <Input fluid
              icon={<Icon name="smile outline" size="large" />}
              placeholder='Type a message'
              style={{ flexGrow: '1', margin: '0 12px' }}
              value={input}
              onChange={handleInputChange}
            /> */}
            <InputWithMentions
              mentions={channelUsers}
              editorState={editorState}
              setEditorState={setEditorState} />
            <Icon name="camera" size="big" />
          </>}
      </Grid.Row>
      <ChannelInfo
        channelInfoModalOpen={channelInfoModalOpen}
        setChannelInfoModalOpen={setChannelInfoModalOpen}
        channelData={channelData}
        channelUsers={channelUsers} />
    </>
  )
}

export default ChannelContent;