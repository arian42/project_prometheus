import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import shave from 'shave';

import { fetchChats, setConversation } from '../../../redux/chat/chatReducer.js';

import './ConversationListItem.css';

export default function ConversationListItem(props) {

  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  let { username, avatar, name, text } = props.data;
  console.log(username, name, avatar, text);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setConversation({name, username, avatar}));
    dispatch(fetchChats({name, username, avatar}));
  }

  return (
    <button onClick={() => handleClick()}>
      <div className="conversation-list-item">
        <img className="conversation-photo" src={avatar} alt="#" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          {
            text ? 
              <p className="conversation-snippet">{ text }</p>
            :
              <p className="conversation-snippet">@{username}</p>
          }
        </div>
      </div>
    </button>
  );
}