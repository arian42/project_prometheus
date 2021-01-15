import { useState } from 'react';
import './UsernameSearch.scss';
import { useDispatch } from 'react-redux';

import { profileSearch } from '../../../redux/user/userReducer';

export default function ConversationSearch() {

  const dispatch = useDispatch();
  const [Person, setPerson] = useState("");
  
  const handleChange = event => {
    setPerson(`${event.target.value}`);
    dispatch(profileSearch(Person));
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