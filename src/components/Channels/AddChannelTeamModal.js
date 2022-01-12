import React, { useState } from "react";

import { Button, Image, Icon, Input, Modal, Checkbox, Container } from 'semantic-ui-react';

const AddChannelTeamModal = (props) => {
  const { addChannelTeamModalOpen, setAddChannelTeamModalOpen,
    workspaceUsers, addUsersToChannel } = props;

  const [query, setQuery] = useState("");
  // Object mapping index with data (easier to add or remove)
  const [selectedUsers, setSelectedUsers] = useState({});

  const handleCancel = () => {
    setAddChannelTeamModalOpen(false);
  }

  const handleChange = (e) => {
    setQuery(e.target.value);
  }

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      // add
      let newSelectedUsers = {
        ...selectedUsers,
        [value]: workspaceUsers[value]
      };
      setSelectedUsers(newSelectedUsers);
    } else {
      //remove
      let newSelectedUsers = { ...selectedUsers };
      delete newSelectedUsers[value];
      setSelectedUsers(newSelectedUsers);
    }
  }

  const handleDoneBtn = async () => {
    await addUsersToChannel(selectedUsers);
    setAddChannelTeamModalOpen(false);
  }

  return (
    <Modal
      size="tiny"
      open={addChannelTeamModalOpen}
      onClose={handleCancel}
      onOpen={() => setAddChannelTeamModalOpen(true)}
      style={{ padding: '16px 0' }}>
      <Modal.Header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        Add team Members <Icon name="close" onClick={handleCancel} />
      </Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Input fluid
            value={query}
            placeholder="Enter a name of your team member"
            onChange={handleChange}
            style={{ marginBottom: '24px' }} />
          {workspaceUsers &&
            workspaceUsers.map((user, index) => (
              <Container style={{
                display: 'flex', justifyContent: 'start', alignItems: 'center',
                margin: '12px 0'
              }}>
                <div className="ui checkbox" style={{ marginRight: '12px' }}>
                  <input type="checkbox"
                    onChange={handleCheckboxChange}
                    value={index} />
                  <label></label>
                </div>
                <Image src={user.thumbImage} size="mini" avatar />
                <span style={{ marginLeft: '8px' }}>{user.name}</span>
              </Container>
            ))
          }
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions style={{ textAlign: 'left', border: 'none', background: 'transparent' }}>
        <Button color='black' onClick={handleDoneBtn}
          style={{ color: 'rgba(180, 141, 94, 1)', paddingLeft: '2rem', paddingRight: '2rem' }}>
          Done
        </Button>
        <Button basic color='black'
          onClick={handleCancel}
          style={{ boxShadow: 'none' }}>
          Skip for now
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default AddChannelTeamModal;