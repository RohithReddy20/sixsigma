import React, { useEffect, useRef } from "react";
import { Checkbox, Grid, Icon, Image } from "semantic-ui-react";

import firebase from '../../utils/init-firebase';

import './ChannelThread.css';

const ChannelThreads = (props) => {

  const {
    channelData,
    channelUsers,
    channelThreads,
    isSelectingThreads,
    selectedThreads,
    setSelectedThreads } = props;

  const scrollRef = useRef(null);

  const handleChange = (e, thread) => {
    const { checked } = e.target;
    if (checked) {
      // add
      let newSelectedThreads = {
        ...selectedThreads,
        [thread.threadId]: thread
      }
      setSelectedThreads(newSelectedThreads);
    } else {
      // remove
      delete selectedThreads[thread.threadId];
      let newSelectedThreads = { ...selectedThreads };
      setSelectedThreads(newSelectedThreads);
    }
  }

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: 'start' });
    }
  }, [channelThreads]);

  return (
    <Grid.Row
      className="cha-con-thread-grid">
      {channelThreads &&
        channelThreads.map((thread, index) => (
          <div key={index}
            className={`cha-con-thread-container 
            ${thread.sender_id === firebase.auth().currentUser.uid ?
                'cha-con-thread-container-right' : ''}`}>
            {isSelectingThreads &&
              <div className="ui checkbox"
                style={{
                  marginRight: `${thread.sender_id === firebase.auth().currentUser.uid ? 'auto' : '12px'}`,
                  marginTop: '8px',
                }}>
                <input type="checkbox"
                  onChange={(e) => { handleChange(e, thread) }} />
                <label></label>
              </div>
            }
            <Image src={thread.sender_thumb}
              avatar size="mini"
              className="cha-con-thread-avatar" />
            <div className="cha-con-thread">
              {thread.sender_id !== firebase.auth().currentUser.uid ?
                <h4>{thread.sender_name}</h4>
                : ''}
              <div className="cha-con-thread-msg" >
                <div className="cha-con-thread-msg-content">
                  {(thread.mentions && thread.mentions.length > 0) ?
                    <>
                      {thread.mentions.map((mention, index) => (
                        <>
                          {index === 0 ?
                            <>
                              {thread.text.slice(0, mention['offset'])}
                              <span className="cha-con-thread-msg-content-mention">
                                {thread.text.slice(mention['offset'], mention['offset'] + mention['length'])}
                              </span>
                            </>
                            :
                            <>
                              {thread.text.slice(
                                thread.mentions[index - 1].offset + thread.mentions[index - 1].length,
                                mention['offset'])}
                              <span className="cha-con-thread-msg-content-mention">
                                {thread.text.slice(mention['offset'], mention['offset'] + mention['length'])}
                              </span>
                            </>}
                        </>
                      ))}
                      {thread.text.slice(
                        thread.mentions[thread.mentions.length - 1]['offset'] + thread.mentions[thread.mentions.length - 1]['length']
                      )}
                    </>
                    :
                    thread.text}
                </div>
                <Icon name="angle down"
                  className="cha-con-thread-msg-icon" />
              </div>
            </div>
          </div>
        ))}
      <div ref={scrollRef}
        className="scroll-ref"
        style={{ width: '100%', height: '2px' }}></div>
    </Grid.Row>
  )
}

export default ChannelThreads;