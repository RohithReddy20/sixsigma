import React, { useState } from "react";

import firebase from '../../utils/init-firebase';

import { Grid, Header, Icon, Image, Menu, Modal, Container } from "semantic-ui-react";
import './ChannelInfo.css';
import { useEffect } from "react/cjs/react.development";

const ChannelInfo = (props) => {
  const {
    channelInfoModalOpen,
    setChannelInfoModalOpen,
    channelData,
    channelUsers
  } = props;

  const [activeMenu, setActiveMenu] = useState("about");
  const [isAdmin, setIsAdmin] = useState(false);

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleCancel = () => {
    setActiveMenu("about");
    setChannelInfoModalOpen(false);
  }

  const handleMenuClick = (e, { name }) => {
    setActiveMenu(name);
  }

  const checkIfAdmin = (uid) => {
    if (channelData) {
      if (channelData.admins && (channelData.admins).find(userId => userId === uid)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }

  const handleAddPeople = () => {
    console.log("ADD PEOPLE HERE");
  }

  const getDateInFormat = (timeStamp) => {
    let date_str = '';
    let date = {
      day: timeStamp.toDate().getDate(),
      month: timeStamp.toDate().getMonth(),
      year: timeStamp.toDate().getFullYear()
    }
    date_str += `${date.day}`;
    if (date.day === 1) {
      date_str += 'st ';
    } else if (date.day === 2) {
      date_str += 'nd ';
    } else if (date.day === 3) {
      date_str += 'rd ';
    } else {
      date_str += 'th ';
    }
    date_str += `${MONTHS[date.month]}, ${date.year}`;
    return date_str;
  }

  useEffect(() => {
    checkIfAdmin(firebase.auth().currentUser.uid);
  }, [channelData]);

  return (
    <Modal
      size="tiny"
      open={channelInfoModalOpen}
      onClose={handleCancel}
      onOpen={() => { setChannelInfoModalOpen(true) }}
      style={{ padding: '16px 0', paddingBottom: '0' }}>
      <Modal.Header
        style={{ border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          <Icon name="hashtag" />{channelData.name}
        </span>
        <Icon name="close" onClick={handleCancel}
          style={{ cursor: 'pointer' }} />
      </Modal.Header>
      <Menu pointing secondary
        className="channels-info-menu"
        style={{ padding: '0 24px', marginBottom: '0' }}>
        <Menu.Item
          name='about'
          active={activeMenu === "about"}
          onClick={handleMenuClick}
        />
        <Menu.Item
          name='members'
          active={activeMenu === "members"}
          onClick={handleMenuClick}
        />
      </Menu>
      {activeMenu === "about" ?
        <div className="info-about-container">
          <div className="info-about-content">
            <div className="info-about-item">
              <div className="info-about-item-header">
                <h4>Topic</h4>
                <button>Edit</button>
              </div>
              <div className="info-about-item-content">
                Add a topic
              </div>
            </div>
            <div className="info-about-item">
              <div className="info-about-item-header">
                <h4>Channel Description</h4>
                <button>Edit</button>
              </div>
              <div className="info-about-item-content">
                {channelData.desc ? channelData.desc : 'Add a description'}
              </div>
            </div>
            <div className="info-about-item">
              <div className="info-about-item-header">
                <h4>Created by</h4>
              </div>
              <div className="info-about-item-content">
                {channelData.createdBy &&
                  `${channelData.createdBy.name} on ${getDateInFormat(channelData.createdBy.timeStamp)}`}
              </div>
            </div>
          </div>
        </div>
        : <></>}
      {activeMenu === "members" ?
        <div className="info-member-container">
          <Container
            className="info-member-container-item">
            <div id="info-member-container-item-addPpl"
              className="info-member-container-item-avatar"
              onClick={handleAddPeople}>
              <Icon name="add user" size="large" circular
                inverted color='grey'
                style={{ fontSize: '18px' }} />
              <span
                style={{ color: '#000', marginLeft: '8px', fontSize: '1.1rem' }}>
                Add people
              </span>
            </div>
          </Container>
          {channelUsers &&
            channelUsers.map((user, index) => (
              <Container key={index}
                className="info-member-container-item">
                <div className="info-member-container-item-avatar">
                  <Image src={user.thumbImage} size="mini" avatar />
                  <span
                    style={{ color: '#000', marginLeft: '8px', fontSize: '1.1rem' }}>
                    {user.name} {firebase.auth().currentUser.uid === user.uid ? ' (you) ' : ''}
                  </span>
                </div>
                {isAdmin && firebase.auth().currentUser.uid !== user.uid ?
                  <button
                    className="info-member-container-item-btn"
                    onClick={() => { }}>Remove</button>
                  : <></>}
              </Container>
            ))
          }
        </div>
        : <></>}
    </Modal >
  )
}

export default ChannelInfo;