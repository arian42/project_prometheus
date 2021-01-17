import {Fragment,useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import UsernameSearch from '../UsernameSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import { fetchChatsList } from '../../../redux/chat/chatReducer';
import {nullUserSearch} from '../../../redux/user/userReducer';
import { on } from '../../../redux/ui/uiReducer'
import { useDispatch, useSelector } from 'react-redux';

import './ConversationList.css';

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  const [messagesSearch, setMessagesSearch] = useState(true);

  const dispatch = useDispatch();
  const response = useSelector(state => state.chat);

  const toggle = (value) => {
    if (value === false) {
      dispatch(nullUserSearch());
    }
    setMessagesSearch( value ? false : true);
  }

  const getConversations = () => {
    dispatch(fetchChatsList());

    let newConversations = response.chatsList.map(result => {
      if (result.lastmsg){
        return {
          avatar: "https://randomuser.me/api/portraits/women/12.jpg",
          name: `${result.name}`,
          text: `${result.lastmsg}`,
          username: `${result.username}`,
        };
      } else{
        return {
          avatar: "https://randomuser.me/api/portraits/women/12.jpg",
          name: `${result.name}`,
          username: `${result.username}`,
          text: false,
        }
      }
      
    });
    setConversations([...conversations, ...newConversations]);
  }

  useEffect(() => {
    getConversations();
    // eslint-disable-next-line
  },[]);

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
              <ToolbarButton key="add" icon="ion-ios-add-circle-outline" func={()=>toggle(messagesSearch)}/>
            ]}
          />
          {
            messagesSearch
            ?
              <ConversationSearch />
            :
              <UsernameSearch />
          }
          {
            conversations.map(conversation =>
              <ConversationListItem
                key={conversation.name}
                data={conversation}
              />
            )
          }
        </Fragment>
      }
    </div>
  );
}