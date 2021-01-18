import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import shave from 'shave';

import { fetchChats, setConversation } from '../../../redux/chat/chatReducer.js';

import './ConversationListItem.css';

export default function ConversationListItem(props) {

  useEffect(() => {
    shave('.conversation-snippet', 20);
  });

  // // eslint-disable-next-line no-unused-vars
  // let { profile, lastmsg, newmsg } = props.data;
  // const {username, name, avatar} = profile;
  const dispatch = useDispatch();

  const  { username, name, avatar, lastmsg, newmsg } = props.data;

  const handleClick = () => {
    dispatch(setConversation({avatar, name, username}));
    dispatch(fetchChats(username));
  };

  return (
    <button onClick={() => handleClick()}>
      <div className="conversation-list-item">
        <img className="conversation-photo" src={avatar} alt="#" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          {
            lastmsg ? 
              <p className="conversation-snippet">{ lastmsg }</p>
            :
              <p className="conversation-snippet">@{username}</p>
          }
        </div>
      </div>
    </button>
  );
}