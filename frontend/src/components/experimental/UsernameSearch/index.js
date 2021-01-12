import { useState } from 'react';
import './ConversationSearch.css';

export default function ConversationSearch() {

  const [Person, setPerson] = useState("");
  
  const handleChange = event => {
    setPerson(`${event.target.value}`);
  }

  return (
    <div className="conversation-search">
      <input
        type="search"
        className="conversation-search-input" 
        placeholder="Search People"
        onChange={handleChange}
        value={Person}
        label="Search People"
      />
    </div>
  );
}