import {Fragment,useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import UsernameSearch from '../UsernameSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import { fetchChatsList, nullChatsList } from '../../../redux/chat/chatReducer';
import { on, toggle } from '../../../redux/ui/uiReducer'
import { useDispatch, useSelector } from 'react-redux';

import './ConversationList.css';

export default function ConversationList() {
  const dispatch = useDispatch();
  const chatsList = useSelector(state => state.chat.chatsList);
  const  usernameSearch = useSelector(state => state.ui.usernameSearch);

  const togglePrimary = () => {
    dispatch(toggle('usernameSearch'));
    dispatch(nullChatsList());
    
  };

  useEffect(() => {
    const intervalId = setInterval( () => {
      if(!usernameSearch) {
        dispatch(fetchChatsList());
      }
    }, 10000);

    return () => clearInterval(intervalId);
  });
 

  return (
    <div className="conversation-list">
      {
        <Fragment>
          <Toolbar
            title="Messenger"
            leftItems={[
              <ToolbarButton key="cog" icon="ion-ios-cog" func={() => dispatch(on('settings'))}/>
            ]}
            rightItems={[
              <ToolbarButton key="add" icon="ion-ios-add-circle-outline" func={()=>togglePrimary()}/>
            ]}
          />
          {
            !usernameSearch
            ?
              <ConversationSearch />
            :
              <UsernameSearch />
          }
          {
            chatsList.map(conversation =>
              <ConversationListItem
                key={conversation.username}
                data={conversation}
              />
            )
          }
        </Fragment>
      }
    </div>
  );
}