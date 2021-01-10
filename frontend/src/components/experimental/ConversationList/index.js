import {Fragment,useState, useEffect} from 'react';
import ConversationSearch from '../ConversationSearch';
import UsernameSearch from '../UsernameSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import { fetchChatsList } from '../../../redux/chat/chatReducer';
import { useDispatch, useSelector } from 'react-redux';

import './ConversationList.css';

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);
  const [messagesSearch, setMessagesSearch] = useState(true);

  const toggle = (value) => setMessagesSearch( value ? false : true);

  const dispatch = useDispatch();
  const response = useSelector(state => state.chat);

  const getConversations = () => {
    dispatch(fetchChatsList());

    let newConversations = response.chatsList.map(result => {
      return {
        photo: result.profile.avatar,
        name: `${result.profile.name}`,
        text: `${result.lastmsg}`,
      };
    });

    setConversations([...conversations, ...newConversations]);
  }

  useEffect(() => {
    getConversations();
  },[]);

  return (
    <div className="conversation-list">
      {
        messagesSearch
        ?
          <Fragment>
            <Toolbar
              title="Messenger"
              leftItems={[
                <ToolbarButton key="cog" icon="ion-ios-cog" />
              ]}
              rightItems={[
                <ToolbarButton key="add" icon="ion-ios-add-circle-outline" func={()=>toggle(messagesSearch)}/>
              ]}
            />
            <ConversationSearch />
            {
              conversations.map(conversation =>
                <ConversationListItem
                  key={conversation.name}
                  data={conversation}
                />
              )
            }
          </Fragment>
        : 
          <Fragment>
            <Toolbar
                title="Messenger"
                leftItems={[
                  <ToolbarButton key="cog" icon="ion-ios-cog" />
                ]}
                rightItems={[
                  <ToolbarButton key="add" icon="ion-ios-add-circle-outline" color="red" func={()=>toggle(messagesSearch)}/>
                ]}
              />
            <UsernameSearch />
          </Fragment>
      }
    </div>
  );
}