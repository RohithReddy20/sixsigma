import React, { useState } from "react";
import { Checkbox, Box, Button, Modal, Typography } from "@mui/material";
import "./Announcements.css";
import useStyles from "./AnnouncementModalStyles";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import $ from "jquery";

import { collection, addDoc } from "firebase/firestore";

import { db } from "../../utils/init-firebase";

function AnnouncementModal({ openModal, handleOpenModal }) {
  const { currentUser } = useAuth();

  //announcement title and description

  const announcementCollectionRef = collection(
    db,
    "workspaces/zepto/announcements"
  );

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [open, setOpen] = React.useState(openModal);
  const handleClose = () => {
    setOpen(false);
    handleOpenModal();
  };

  //creating announcement
  const createAnnouncement = async () => {
    if (announcementTitle === "" || announcementDescription === "") {
      handleClose();
      Swal.fire(
        "Title of announcement and description are required",
        "",
        "error"
      );
      return;
    }

    try {
      const createdBy = {
        name: currentUser.displayName
          ? currentUser.displayName
          : currentUser.email,
        thumbimage: currentUser.photoURL,
        uid: currentUser.uid,
      };

      await addDoc(announcementCollectionRef, {
        title: announcementTitle,
        description: announcementDescription,
        members: [currentUser.uid],
        isPrivate: isPrivate,
        createdat: new Date(),
        createdBy: createdBy,
      });
      handleClose();
      Swal.fire("Announcement created successfully", "", "success");
    } catch (error) {
      console.log("Failed to create announcement " + error);
    }
  };

  return (
    <div>
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={useStyles.box}>
            <div className="modal-title-desc">
              <Typography
                sx={useStyles.title}
                pl={4}
                id="modal-modal-title"
                component="div"
              >
                <Typography sx={useStyles.titlem} variant="h6">
                  Add Announcement
                </Typography>
                <img
                  onClick={handleClose}
                  src="./images/CancelIcon.svg"
                  alt="cancel"
                />
              </Typography>
              <div className="title-of-ann">
                <h3>Title</h3>
                <input
                  onChange={(event) => setAnnouncementTitle(event.target.value)}
                  type="text"
                  className="title-field"
                  placeholder="Enter the title of your announcement"
                />
              </div>
              <div className="description">
                <h3>Description</h3>
                <textarea
                  onChange={(event) =>
                    setAnnouncementDescription(event.target.value)
                  }
                  className="description-field"
                  placeholder=""
                ></textarea>
              </div>
              <div className="audience">
                <h3>Audience</h3>
                <button
                  className="public"
                  onClick={() => {
                    $(".public").toggleClass("active");
                    if ($(".private").hasClass("active")) {
                      $(".private").toggleClass("active");
                    }
                  }}
                >
                  <img src="./images/WorldIcon.svg" alt="world" /> Public to
                  everyone
                </button>
                <button
                  className="private"
                  onClick={() => {
                    setIsPrivate(true);
                    if(!$(".private").hasClass("active")){
                      $(".private").toggleClass("active");
                    }
                    if ($(".public").hasClass("active")) {
                      $(".public").toggleClass("active");
                    }
                    $(".modal-title-desc").toggleClass("modal-undisplayed");
                    if ($(".user-selection").hasClass("modal-undisplayed")) {
                      $(".user-selection").toggleClass("modal-undisplayed");
                    }
                  }}
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.9"
                      d="M18.1664 14.3825C17.5853 13.2221 15.6006 12.4951 12.8543 11.4879C12.3318 11.2976 12.0025 11.2187 11.8552 10.7948C11.686 10.3821 11.7319 9.91275 11.9779 9.54047C13.0665 8.36745 13.6008 6.61028 13.6008 4.3416C13.6008 1.34195 11.5425 0 9.5 0C7.45749 0 5.39916 1.34195 5.39916 4.3416C5.39916 6.61028 5.93354 8.36745 7.02209 9.54047C7.2681 9.91276 7.31404 10.3821 7.14479 10.7948C6.99754 11.2187 6.66978 11.2976 6.14571 11.4879C3.39942 12.4951 1.4147 13.2245 0.833614 14.3825C0.320714 15.4378 0.0366868 16.589 0 17.7611C0 17.9791 0.177226 18.1558 0.395826 18.1558H18.6042C18.8228 18.1558 19 17.9791 19 17.7611C18.9633 16.589 18.6793 15.4378 18.1664 14.3825Z"
                      fill="currentColor"
                    />
                  </svg>{" "}
                  Specific members
                </button>
              </div>
              <div className="add-cancel">
                <Button
                  onClick={createAnnouncement}
                  sx={useStyles.add}
                  id="add-button"
                >
                  Add
                </Button>
                <Button
                  onClick={handleClose}
                  sx={useStyles.cancel}
                  variant="text"
                  id="cancel-button"
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="user-selection modal-undisplayed">
              <Typography
                sx={useStyles.title}
                pl={4}
                id="modal-modal-title"
                component="div"
              >
                <Typography sx={useStyles.titlem} variant="h6">
                  <img
                    onClick={() => {
                      $(".user-selection").toggleClass("modal-undisplayed");
                      if (
                        $(".modal-title-desc").hasClass("modal-undisplayed")
                      ) {
                        $(".modal-title-desc").toggleClass("modal-undisplayed");
                      }
                    }}
                    className="bfr-tl"
                    src="./images/NextIcon.svg"
                    alt="Next"
                  />
                  Team Members
                </Typography>
                <img
                  onClick={handleClose}
                  src="./images/CancelIcon.svg"
                  alt="cancel"
                />
              </Typography>
              <div className="search-field">
                <input
                  type="text"
                  className="title-field"
                  placeholder="Enter a name of your team member"
                />
              </div>

              <div className="user-list">
                <ul className="user-items">
                  <li className="user-item">
                    <Checkbox value="Mike Tyson" size="small" />
                    <img src="./images/man1.png" alt="user-img" />
                    Mike Tyson
                  </li>
                  <li className="user-item">
                    <Checkbox value="Mike Tyson" size="small" />
                    <img src="./images/man1.png" alt="user-img" />
                    Mike Tyson
                  </li>
                  <li className="user-item">
                    <Checkbox value="Mike Tyson" size="small" />
                    <img src="./images/man1.png" alt="user-img" />
                    Mike Tyson
                  </li>
                  <li className="user-item">
                    <Checkbox value="Mike Tyson" size="small" />
                    <img src="./images/man1.png" alt="user-img" />
                    Mike Tyson
                  </li>
                </ul>
              </div>
              <div className="add-cancel">
                <Button
                  onClick={() => {
                    $(".user-selection").toggleClass("modal-undisplayed");
                    if ($(".modal-title-desc").hasClass("modal-undisplayed")) {
                      $(".modal-title-desc").toggleClass("modal-undisplayed");
                    }
                  }}
                  sx={useStyles.add}
                  id="add-button"
                >
                  Done
                </Button>
                <Button
                  onClick={handleClose}
                  sx={useStyles.cancel}
                  variant="text"
                  id="cancel-button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default AnnouncementModal;
