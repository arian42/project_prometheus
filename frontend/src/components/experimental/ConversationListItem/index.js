import React, {Fragment, useEffect} from 'react';
import shave from 'shave';

import './ConversationListItem.css';

export default function ConversationListItem(props) {

  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const { user, photo, name, text } = props.data;

  const handleClick = user => {
    
  }

  return (
    <button onClick={() => handleClick(user)}>
      <div className="conversation-list-item">
        <img className="conversation-photo" src={photo} alt="#" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          {
            text ? 
              <p className="conversation-snippet">{ text }</p>
            :
            <Fragment></Fragment>
          }
        </div>
      </div>
    </button>
  );
}