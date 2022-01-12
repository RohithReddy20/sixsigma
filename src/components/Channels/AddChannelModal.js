import React, { useState } from "react";

import { Button, Header, Input, Modal, Radio } from 'semantic-ui-react';

const AddChannelModal = (props) => {
  const { addChannelModalOpen, setAddChannelModalOpen, addChannel } = props;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [makePrivate, setMakePrivate] = useState(false);

  const handleAddBtn = async () => {
    const channelData = {
      name: name,
      desc: desc,
      isPrivate: makePrivate
    }
    if (channelData.name) {
      await addChannel(channelData);
      handleCancel();
    }
  }

  const handleCancel = () => {
    setName("");
    setDesc("");
    setMakePrivate(false);
    setAddChannelModalOpen(false);
  }

  const toggleMakePrivate = () => {
    setMakePrivate(!makePrivate);
  }

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "desc") {
      setDesc(e.target.value);
    }
  }

  return (
    <Modal
      size="tiny"
      open={addChannelModalOpen}
      onClose={handleCancel}
      onOpen={() => setAddChannelModalOpen(true)}
      style={{ padding: '16px 0' }}>
      <Modal.Header>Add a new Channel</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header as="h3">Name</Header>
          <Input fluid
            name="name"
            icon="hashtag"
            iconPosition="left"
            placeholder="e.g. Finance Team"
            value={name}
            onChange={handleChange} />
          <Header as="h3">
            Description
            <Header.Subheader style={{ display: 'inline', marginLeft: '12px' }}> (Optional)</Header.Subheader>
          </Header>
          <Input fluid
            name="desc"
            placeholder="What's this channel about?"
            value={desc}
            onChange={handleChange} />
          <Header as="h3" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            Make channel private
            <Radio toggle
              checked={makePrivate}
              onChange={toggleMakePrivate} />
          </Header>
          <p>
            When a channel is private it is not visible to the rest of the team.
            <br></br>
            A private group cannot be made public later
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions style={{ textAlign: 'left', border: 'none', background: 'transparent' }}>
        <Button color='black' onClick={handleAddBtn}
          style={{ color: 'rgba(180, 141, 94, 1)', paddingLeft: '2rem', paddingRight: '2rem' }}>
          Add
        </Button>
        <Button basic color='black'
          onClick={handleCancel}
          style={{ boxShadow: 'none' }}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default AddChannelModal;