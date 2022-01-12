import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContext';

import SignInPage from './components/pages/SignInPage';
import ResetPassword from './components/pages/ResetPassword';
import SignUpPage from './components/pages/SignUpPage';
import WorkSpaceCreation from './components/pages/WorkSpaceCreation';
import HomePage from './components/pages/HomePage';
import InvitationPage from './components/pages/InvitationPage';
import Channels from './components/Channels/Channels';
import AnnouncementsPage from "./components/pages/AnnouncementsPage";
import AnnouncementModal from './components/Announcements/AnnouncementModal';

const App = () => {
  const [currWorkspace, setCurrWorkspace] = useState(null);

  return (
    <AuthContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/signin" element={<SignInPage />} />
            <Route exact path='/reset-password' element={<ResetPassword />} />
            <Route exact path="/signup" element={<SignUpPage />} />
            <Route exact path="/create-workspace" element={<WorkSpaceCreation setCurrWorkspace={setCurrWorkspace} />} />
            <Route exact path="/invite" element={<InvitationPage />} />
            <Route exact path="/channels" element={<Channels currWorkspace={currWorkspace} />} />
            <Route exact path="/channels/:channelname" element={<Channels currWorkspace={currWorkspace} />} />
            <Route
              exact
              path="/announcements"
              element={<AnnouncementsPage />}
            />
            <Route
              exact
              path="/announcement-modal"
              element={<AnnouncementModal />}
            />
          </Routes>
        </Router>
      </div>
    </AuthContextProvider>
  );
}

export default App;