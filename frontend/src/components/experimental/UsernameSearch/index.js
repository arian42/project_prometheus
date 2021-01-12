import { useState } from 'react';
import './ConversationSearch.scss';

export default function ConversationSearch() {

  const [Person, setPerson] = useState("");
  
  const handleChange = event => {
    setPerson(`${event.target.value}`);
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
          value={Person}
          label="Search People"
        />
      </form>
    </div>
  );
}