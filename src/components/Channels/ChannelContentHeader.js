import React, { useState, useEffect } from "react";

import { Grid, Header, Icon, Image, Menu } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

import firebase from '../../utils/init-firebase';

const ChannelContentHeader = (props) => {
  const {
    channelData,
    channelUsers,
    activeMenu,
    handleMenuItemClick,
    setChannelInfoModalOpen,
    deleteUserFromChannel,
    setIsSelectingThreads } = props;

  const [popupOpen, setPopupOpen] = useState(false);

  const navigate = useNavigate();

  const togglePopupOpen = () => {
    setPopupOpen(!popupOpen);
  }

  const handleExitChannel = async () => {
    await deleteUserFromChannel(firebase.auth().currentUser.uid, channelData.name);
    navigate('/channels');
  }

  return (
    <Grid.Row columns={3}
      className="channels-contents-header">
      <Grid style={{ margin: '0', height: '100%' }}>
        <Grid.Column width={6}
          className="channels-contents-name">
          <h3 style={{ display: 'inline', margin: '0', fontSize: '1.5rem' }}>
            {`# ${channelData.name}`}
          </h3>
        </Grid.Column>
        <Grid.Column width={6}>
          <Menu pointing secondary className="channels-contents-header-menu">
            <Menu.Item
              name="CHAT"
              active={activeMenu === "CHAT"}
              onClick={handleMenuItemClick} />
            <Menu.Item
              name="FILES"
              active={activeMenu === "FILES"}
              onClick={handleMenuItemClick} />
            <Menu.Item
              name="TASKS"
              active={activeMenu === "TASKS"}
              onClick={handleMenuItemClick} />
          </Menu>
        </Grid.Column>
        <Grid.Column width={4}
          className="channels-content-info">
          <div className="channels-content-info-users">
            <div className="channels-content-info-avatars"
              style={{ left: `${channelUsers.length > 2 ? '10px' : '0'}` }}>
              {channelUsers &&
                (channelUsers.slice(0, 3)).map((user, index) => (
                  <>
                    <Image src={user.thumbImage} avatar
                      key={index}
                      className="channels-content-info-img"
                      style={{ left: `${index * -15}px` }} />
                  </>
                ))
              }
            </div>
            {channelUsers ? channelUsers.length : '-'}
          </div>
          <Icon name="info circle" size="large" />
          <div id="channels-content-header-options-btn"
            onClick={togglePopupOpen}>
            <Icon name="options" size="large" />
            {popupOpen ?
              <div className="channels-content-header-options-container">
                <button className="channels-content-header-options-item"
                  onClick={() => { setChannelInfoModalOpen(true) }}>Channel info</button>
                <button className="channels-content-header-options-item"
                  onClick={() => { setIsSelectingThreads(true) }}>Select messages</button>
                <button className="channels-content-header-options-item"
                  onClick={handleExitChannel}>Exit channel</button>
              </div>
              :
              <></>}
          </div>
        </Grid.Column>
      </Grid>
    </Grid.Row>
  )
}

export default ChannelContentHeader;