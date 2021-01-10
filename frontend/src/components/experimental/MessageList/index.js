import React,
  {
    //useEffect,
    useState
  } from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import { useSelector } from 'react-redux'
//import { useHistory } from "react-router-dom";

import './MessageList.css';

export default function MessageList(props) {
  const [messages, 
    //setMessages
  ] = useState([]);
  //const token = useSelector( state => state.user.token );
  const MY_USER_ID = useSelector( state => state.user.profile.username);

  //let history = useHistory();

  // useEffect(() => {
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

    // const intervalId = setInterval(() => {
    //     fetchingChat();
    // }, 2000000);

    // return () => clearInterval(intervalId);

  // }, [token, history]);



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
        <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

        <Compose rightItems={[
          <ToolbarButton key="send" icon="ion-navigate-outline" />,
          //<ToolbarButton key="photo" icon="ion-ios-camera" />,
          //<ToolbarButton key="image" icon="ion-ios-image" />,
          //<ToolbarButton key="audio" icon="ion-ios-mic" />,
          //<ToolbarButton key="money" icon="ion-ios-card" />,
          //<ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          //<ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]}/>
      </div>
    );
}