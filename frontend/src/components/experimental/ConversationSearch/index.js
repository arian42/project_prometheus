import { useState } from 'react';
import './ConversationSearch.css';

export default function ConversationSearch() {
  const [Conversation, setConversation] = useState("");
  
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
          placeholder="Search People"
          onChange={handleChange}
          value={Conversation}
          label="Search Conversation"
        />
      </form>
    </div>
  );
}