import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// import { Grid, Header, Menu, Sticky, Icon, Segment } from 'semantic-ui-react';
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  FaBuromobelexperte,
  FaBullhorn,
  FaSlackHash,
  FaEnvelope,
} from "react-icons/fa";

import './Sidebar.css';

const Sidebar = () => {
  // const [active, setActive] = useState("");

  // const handleItemClick = (e, { name }) => {
  //   setActive(name);
  // }

  return (
    <div className="sidebar">
      <ProSidebar>
        <Link to="/" className='sidebar-links'>
          <Menu iconShape="square">
            <MenuItem icon={<FaBuromobelexperte />}>Dashboard</MenuItem>
          </Menu>
        </Link>
        <Link to="/announcements" className='sidebar-links'>
          <Menu iconShape="square">
            <MenuItem icon={<FaBullhorn />}>Announcements</MenuItem>
          </Menu>
        </Link>
        <Link to="/channels" className='sidebar-links'>
          <Menu iconShape="square">
            <MenuItem icon={<FaSlackHash />}>Channels</MenuItem>
          </Menu>
        </Link>
        <Link to="/" className='sidebar-links'>
          <Menu iconShape="square">
            <MenuItem icon={<FaEnvelope />}>Direct Messages</MenuItem>
          </Menu>
        </Link>
      </ProSidebar>
    </div>

    //     <div className="sidebar">
    //       <Menu text vertical
    //         className='sidebar-menu'>
    //         <Menu.Item
    //           name='dashboard'
    //           active={active === 'dashboard'}
    //           onClick={handleItemClick}
    //           className='sidebar-menu-item'>
    //           <Link to='/'>
    //             <Icon name='announcement' /> Dashboard
    //           </Link>
    //         </Menu.Item>
    //         <Menu.Item
    //           name='announcements'
    //           active={active === 'announcements'}
    //           onClick={handleItemClick}
    //           className='sidebar-menu-item'>
    //           <Link to='/'>
    //             <Icon name='announcement' /> Announcements
    //           </Link>
    //         </Menu.Item>
    //         <Menu.Item
    //           name='channels'
    //           active={active === 'channels'}
    //           onClick={handleItemClick}
    //           className='sidebar-menu-item'>
    //           <Link to='/channels'>
    //             <Icon name='announcement' /> Channels
    //           </Link>
    //         </Menu.Item>
    //         <Menu.Item
    //           name='directmessages'
    //           active={active === 'directmessages'}
    //           onClick={handleItemClick}
    //           className='sidebar-menu-item'>
    //           <Link to='/'>
    //             <Icon name='announcement' /> Direct Messages
    //           </Link>
    //         </Menu.Item>
    //       </Menu>
    //     </div>
  )
}

export default Sidebar;
