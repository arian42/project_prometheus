import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

//import { profileSearch } from '../../../redux/user/userReducer';
import { profileSearch } from '../../redux/chat/chatReducer';

import './username-search.styles.scss';

export default function ConversationSearch() {
  const [person, setPerson] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileSearch(person));
  }, [person, dispatch]);
  
  const handleChange = event => {
    console.log(event.target.value);
    setPerson(event.target.value);
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
          value={person}
          label="Search People"
        />
      </form>
    </div>
  );
};