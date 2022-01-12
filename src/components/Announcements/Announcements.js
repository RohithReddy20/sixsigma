import React, { useState, useEffect} from "react";
import "./Announcements.css";
import AnnouncementModal from "./AnnouncementModal";
import $ from "jquery";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../utils/init-firebase";

function Announcements() {
  //open announcements modal
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => {
    openModal ? setOpenModal(false) : setOpenModal(true);
  };

  const [announcements, setAnnouncements] = useState([]);

  //get announcemets from collection workspace document zepto from firebase
  const announcementCollectionRef = collection(db, "workspaces/zepto/announcements");

  useEffect(() => {
  const announcementsCollection = async () => {
    const data = await getDocs(announcementCollectionRef);
    setAnnouncements(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  announcementsCollection();
  // console.log(announcements);
  }, []);

   //function to add class rotate to element with class addfile on clicking
  const handleAddFile = () => {
    $(".addfile").toggleClass("rotate");
    //add changeposition class to write-message class and addfile class
    $(".write-message").toggleClass("changeposition");
    $(".file-select").toggleClass("changeposition");
  };

  const uploadFile = () => {
    $('.select-file').trigger('click');
  }

  const capturePhoto = () => {
    $('.camera-file').trigger('click');
  }

  return (
    <div className="announcements">
      <div className="announcements-lists">
        <div className="announcements-header">
          <h3>Announcements</h3>
          <button onClick={handleOpenModal}>
            <img src="./images/AddIcon.svg" alt="Add" className="add-icon" />
            Add
          </button>
        </div>
        <div className="announcements-list">
          <ul className="list-items">
            {
              announcements.map(announcement => {
                // console.log(user.workspaces.includes("zepto"));
                return (
                  <li key={announcement.id} className="list-item">
              <p>
                <img src="./images/AnnouncementsIcon.svg" alt="Announcements" />
                {announcement.title} <span>5</span>
              </p>
              <p className="date">
                {announcement.createdAt && announcement.createdAt.toDate().getFullYear()+"/"+(announcement.createdAt.toDate().getMonth()+1)+"/"+announcement.createdAt.toDate().getDate()}
                <img src="./images/NextIcon.svg" alt="Next" />
              </p>
            </li>
                );
              })
                  
            }
          </ul>
        </div>
      </div>
      <div className="announcements-comments">
        <div className="user-header">
          <div className="user-info">
            <div className="user-photo">
              <img src="./images/user-pic.png" alt="User" />
            </div>
            <div className="name-post-date">
              <div className="user-name">Luke Vaughan</div>
              <div className="post-date">Posted on 11 November, 2021</div>
            </div>
          </div>

          <div className="th-dots">
            <img src="./images/Threedots.svg" alt="menu" />
          </div>
        </div>
        <div className="announcements-info">
          <div className="announcements-title-description">
            <div className="announcements-title">
              <h3>Happy Birthday Rahul</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
        <div className="comments">
          <div className="no-of-comments">2 comments</div>
          <div className="comments-chat">
            <ul className="chat">
              <li className="chat-item">
                <div className="user-photo">
                  <img src="./images/man1.png" alt="user-img" />
                </div>
                <div className="chat-message">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </li>
              <li className="chat-item">
                <div className="user-photo">
                  <img src="./images/man1.png" alt="user-img" />
                </div>
                <div className="chat-message">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </div>
                
              </li>
            </ul>
          </div>
          <div className="write-message">
            <div className="user-photo">
              <img src="./images/user-pic.png" alt="user-img" />
            </div>
            <div className="message-box">
              <input type="text" placeholder="Type a comment" />
              <img onClick={capturePhoto} src="./images/CameraIcon.svg" alt="camera" />
              <img onClick={handleAddFile} className="addfile" src="./images/AddFilesIcon.svg" alt="files" />
            </div>
          </div>
          <div className="file-select">
            <input type="file" className="select-file" style={{display: "none"}} />
            <input type="file" accept="image/*" capture="user" className="camera-file" style={{display: "none"}} />
            <div onClick={uploadFile} className="camera-file">
              <img src="./images/CameraFile.svg" alt="camera" />
            </div>
            <div onClick={uploadFile} className="pdf-file">
              <img src="./images/Group.png" alt="camera" />
            </div>
            <div onClick={uploadFile} className="file">
              <img src="./images/Files.png" alt="camera" />
            </div>
            <div onClick={uploadFile} className="user-file">
              <img src="./images/User.png" alt="camera" />
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <AnnouncementModal
          openModal={openModal}
          handleOpenModal={handleOpenModal}
        />
      )}
    </div>
  );
}

export default Announcements;
