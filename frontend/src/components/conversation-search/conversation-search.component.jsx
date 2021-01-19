import { useState } from 'react';
import { 
  //useDispatch
} from 'react-redux';

import './conversation-search.styles.scss';

export default function ConversationSearch() {
  const [Conversation, setConversation] = useState("");
  //const dispatch = useDispatch();
  
  const handleChange = event => {
    setConversation(`${event.target.value}`);
    
  }

  const handleSubmit = async event => {
    event.preventDefault();

  }

  return (
    <div className="conversation-search">
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="search"
          className="conversation-search-input" 
          placeholder="Search Conversations"
          onChange={handleChange}
          value={Conversation}
          label="Search Conversations"
        />
      </form>
    </div>
  );
}