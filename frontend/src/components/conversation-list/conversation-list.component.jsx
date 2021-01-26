import {Fragment, useEffect} from 'react';
import ConversationSearch from '../conversation-search/conversation-search.component';
import UsernameSearch from '../username-search/username-search.component';
import ConversationListItem from '../conversation-list-item/conversation-list-item.component';
import Toolbar from '../toolbar/toolbar.component';
import ToolbarButton from '../toolbar-button/toolbar-button.component';
import { fetchChatsList, nullChatsList } from '../../redux/chat/chatReducer';
import { on, toggle } from '../../redux/ui/uiReducer'
import { useDispatch, useSelector } from 'react-redux';

import './conversation-list.styles.scss';

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
    }, 300);

    return () => clearInterval(intervalId);
  });
 

  return (
    <div className="conversation-list">
       {/* remove ".close" class on click from sidebar (../messenger.component.jsx) */}
      <div id="close-menu-btn"><i className="ion-ios-close-circle-outline"></i></div>
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