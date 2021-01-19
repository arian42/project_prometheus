import React, {Fragment, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import shave from 'shave';

import { fetchChats, setConversation } from '../../redux/chat/chatReducer.js';

import './conversation-list-item.styles.scss';

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

  if (newmsg=== '0'){
    var showNewMessage='';
  }

  return (
    <button className="conversation-list-btn" onClick={() => handleClick()}>
      <div className="conversation-list-item">
        <img className="conversation-photo" src={avatar} alt="#" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          {
            lastmsg ? 
              <Fragment>
                <p className="conversation-snippet">{ lastmsg }</p>
                {
                  showNewMessage ?
                    <p className="new-messages">{newmsg}</p>
                  :
                    <Fragment></Fragment>
                }
              </Fragment>
            :
              <p className="conversation-snippet">@{username}</p>
          }
        </div>
      </div>
    </button>
  );
}