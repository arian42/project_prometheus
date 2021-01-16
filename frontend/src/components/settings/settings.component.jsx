import { useSelector } from 'react-redux'

import './settings.styles.scss';

const Settings = () => {
    const { name, username, avatar } = useSelector(state => state.user.profile);

    return (
        <div>
            <img src={avatar} alt="profile"></img>
            <p>{name}</p>
            <p>@{username}</p>
        </div>
    )
}

export default Settings;