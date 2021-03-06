import {useState} from 'react';
import { 
  useSelector,
  useDispatch
} from 'react-redux';
import { sendMessage as sendMyMessage } from '../../redux/chat/chatReducer';

import './compose.styles.scss';

export default function Compose(props) {
  const currentConversation = useSelector( state => state.chat.currentConversation.username);

  const [message, setMessage] = useState("");
  //const token = useSelector( state => state.user.token );
  const dispatch = useDispatch();

  const sendMessage = async event => {
    event.preventDefault();

    if (message === "" ) {
        return;
    }

    // let messageJSON = {
    //   "msg": `${message}`,
    // }
    
    // fetch("http://127.0.0.1:5000/api/chat",{
    //     headers: {
    //         'x-access-token': `${token}`
    //     },
    //     method: 'post',
    //     body: JSON.stringify(messageJSON)
    // });

    dispatch(sendMyMessage({currentConversation, message}));

    setMessage("");
  }

  const handleChange = event => {
    setMessage(event.target.value);
  }

  return (
    <div className="compose">
      <form onSubmit={sendMessage}>
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message..."
          onChange={handleChange}
          value={message}
          label="message"
        />
      </form>
      <div className="send-btn icon-send"></div>
    </div>
  );
}