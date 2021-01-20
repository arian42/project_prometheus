import React,
  {
    useEffect,
    //useState,
    Fragment
  } from 'react';

import { fetchChats } from '../../redux/chat/chatReducer';

import Spinner from '../spinner/spinner.component.jsx';
import Compose from '../compose/compose.component';
import Toolbar from '../toolbar/toolbar.component';
import ToolbarButton from '../toolbar-button/toolbar-button.component';
import Message from '../message/message.component';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux'
//import { useHistory } from "react-router-dom";
import { on } from '../../redux/ui/uiReducer';

import './message-list.styles.scss';


export default function MessageList(props) {
  const dispatch = useDispatch();
  //const [messages,setMessages] = useState([]);
  //const token = useSelector( state => state.user.token );
  const MY_USER_ID = useSelector( state => state.user.profile.username);
  const currentConversation = useSelector( state => state.chat.currentConversation);
  const messages = useSelector( state => state.chat.chats);
  //let history = useHistory();

  useEffect(() => {
  //   let fetchingChat = async () => {

    //   if (!token) {
    //     history.push('/');
    //     return;
    //   }

    //   let fetchedChat = await fetch("http://127.0.0.1:5000/api/chat", {
    //     headers: {
    //         'x-access-token': `${token}`
    //     },
    //   });
    //   let stringedChat = await fetchedChat.json();
    //   let listedChat = await stringedChat;

    //   //I don't know why the first message sent from server is empty so I simply shift it
    //   listedChat.shift();

    //   setMessages([...listedChat]);
    // };

    // fetchingChat();

    if (currentConversation.username) {
      const username = currentConversation.username;

      const intervalId = setInterval(() => {
          dispatch(fetchChats(username));
      }, 300);

      return () => clearInterval(intervalId);
    }

  }, [dispatch, currentConversation.username]);



  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

    return(
      <div className="message-list">

        {
          currentConversation.name ?
            <Fragment>
              <Toolbar
                title= {`${currentConversation.name}`}
                rightItems={[
                  <ToolbarButton key="info" icon="ion-ios-information-circle-outline" func={() => dispatch(on('info'))}/>,
                  // <ToolbarButton key="video" icon="ion-ios-videocam" />,
                  //<ToolbarButton key="phone" icon="ion-ios-call" />
                ]}
                leftItems={[
                  //add ".close" class on click to sidebar (../messenger.component.jsx)
                  <ToolbarButton key="menu" icon="ion-ios-menu" func={() => dispatch(on('info'))}/>,
                ]}
              />

              <div className="message-list-container">{renderMessages()}</div>

              <Compose rightItems={[
                <ToolbarButton key="send" icon="ion-navigate-outline"/>,
                // <ToolbarButton key="photo" icon="ion-ios-camera" />,
                //<ToolbarButton key="image" icon="ion-ios-image" />,
                //<ToolbarButton key="audio" icon="ion-ios-mic" />,
                //<ToolbarButton key="money" icon="ion-ios-card" />,
                //<ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
                //<ToolbarButton key="emoji" icon="ion-ios-happy" />
              ]}/>
            </Fragment>
          :
            <Fragment>
              <Spinner/>
            </Fragment>
        }
      </div>
    );
}