import { useSelector } from 'react-redux'

import './settings.styles.scss';

const Settings = () => {
    const { name, username, avatar } = useSelector(state => state.user.profile);

    return (
        <div>
            <img src={avatar} alt="profile"/>
            <p>{name}</p>
            <p>@{username}</p>
            <button onClick={()=>{}}>sign out</button>
        </div>
    )
}

export default Settings;