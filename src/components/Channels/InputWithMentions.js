import React, { useState, useEffect } from 'react';

import { EditorState, convertToRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';

import mentionsStyles from './InputWithMentions.module.css';
import './InputWithMentions.css';

const mentionPlugin = createMentionPlugin({
  theme: mentionsStyles,
  mentionPrefix: '@'
});
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

const Entry = (props) => {
  const { mention, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className={mentionsStyles['mentionSuggestionsEntryContainer']}>
        <div className={mentionsStyles['mentionSuggestionsEntryContainerLeft']}>
          {mention.thumbImage &&
            <img src={mention.thumbImage}
              className={mentionsStyles['mentionSuggestionsEntryAvatar']} />
          }
        </div>

        <div className={mentionsStyles['mentionSuggestionsEntryContainerRight']}>
          <div className={mentionsStyles['mentionSuggestionsEntryText']}>
            {mention.name}
          </div>
        </div>
      </div>
    </div>
  )
}

const InputWithMentions = (props) => {
  const { mentions, editorState, setEditorState } = props;

  const [suggestions, setSuggestions] = useState(mentions);
  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [open, setOpen] = useState(false);

  const onSearchChange = ({ value }) => {
    console.log("ONSEARCH CHANGED");
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }

  const onOpenChange = (_open) => {
    console.log("OPEN CHANGED");
    setOpen(_open);
  }

  return (
    <div className='input-with-mentions'>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder='Type a message' />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        onAddMention={() => {
          // get the mention object selected
        }}
        entryComponent={Entry}
        popoverContainer={({ children }) => (
          <div className='popover-container'>
            {children}
          </div>
        )}
      />
    </div>
  )
}

export default InputWithMentions;