import React from "react";

import { Grid, Header, Menu, Sticky, Icon, Container, Segment } from 'semantic-ui-react';

import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="./images/company-logo.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
