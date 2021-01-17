import { useSelector } from 'react-redux'

import './settings.styles.scss';

const Settings = () => {
    const { name, username, avatar } = useSelector(state => state.user.profile);

    return (
        <div className="setting-content">

            <div className="setting-header">
                <div className="title">Settings</div>
                <div className="close-btn">x</div>
            </div>

            <div className="setting-info">
                <div className="profile-pic">
                    <img src={avatar} alt="profile"/>
                </div>
                <div className="username-and-name">
                    <div>
                        <span>Name</span>
                        <p>{name}</p>
                    </div>
                    <div>
                        <span>Username</span>
                        <p>@{username}</p>
                    </div>
                </div>
            </div>

            <button className="signout-btn" onClick={()=>{}}>sign out</button>
        </div>
    )
}

export default Settings;